import { useState, useEffect, useMemo } from 'react';
import { fetchConsultas } from '../services/consultaService';
import { fetchInsumos } from '../services/insumoService';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

// Stock inicial de referencia para calcular 20%
const STOCK_INICIAL = {
  'Guantes': 20,
  'Jeringas': 15,
  'Alcohol': 10
};

export default function GraficosPage() {
  const [consultas, setConsultas] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dataConsultas, dataInsumos] = await Promise.all([
          fetchConsultas(),
          fetchInsumos()
        ]);
        setConsultas(dataConsultas);
        setInsumos(dataInsumos);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // Datos para gráfico de carreras
  const datosPorCarrera = useMemo(() => {
    const conteo = {};
    consultas.forEach(c => {
      const carrera = c.carrera || 'Sin carrera';
      conteo[carrera] = (conteo[carrera] || 0) + 1;
    });
    return Object.entries(conteo).map(([carrera, cantidad]) => ({ carrera, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [consultas]);

  // Datos para gráfico de motivos de consulta
  const datosPorMotivo = useMemo(() => {
    const conteo = {};
    consultas.forEach(c => {
      const motivo = c.motivo || 'Sin motivo';
      conteo[motivo] = (conteo[motivo] || 0) + 1;
    });
    return Object.entries(conteo).map(([motivo, cantidad]) => ({ motivo, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10); // Top 10 motivos
  }, [consultas]);

  // Datos para gráfico de DIAE (Torta)
  const datosDiae = useMemo(() => {
    const conDiae = consultas.filter(c => c.aplicaDiae).length;
    const sinDiae = consultas.length - conDiae;
    return [
      { name: 'Con DIAE', value: conDiae },
      { name: 'Sin DIAE', value: sinDiae }
    ];
  }, [consultas]);

  // Datos para gráfico de insumos con alerta de stock bajo
  const datosInsumos = useMemo(() => {
    return insumos.map(insumo => {
      const stockInicial = STOCK_INICIAL[insumo.nombre] || 20; // Default 20 si no está definido
      const porcentaje = (insumo.cantidad / stockInicial) * 100;
      const stockBajo = porcentaje <= 20;
      
      return {
        nombre: insumo.nombre,
        cantidad: insumo.cantidad,
        stockBajo,
        porcentaje: porcentaje.toFixed(1)
      };
    });
  }, [insumos]);

  // Función para colorear barras según stock
  const getBarColor = (data) => {
    return data.stockBajo ? '#ef4444' : '#667eea';
  };

  // Indicadores
  const totalPacientes = consultas.length;
  const totalDiae = consultas.filter(c => c.aplicaDiae).length;
  const carreras = [...new Set(consultas.map(c => c.carrera).filter(Boolean))];

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="bg-white rounded shadow p-4">
          <h2 className="mb-4 text-primary">Gráficos y Estadísticas</h2>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="bg-white rounded shadow p-4">
        <h2 className="mb-4 text-primary">
          <i className="bi bi-bar-chart-line me-2"></i>
          Gráficos y Estadísticas
        </h2>
        
        {/* Tarjetas de resumen */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-center border-primary mb-3" style={{ borderWidth: '2px' }}>
              <div className="card-body">
                <i className="bi bi-people-fill text-primary" style={{ fontSize: '2rem' }}></i>
                <h5 className="card-title mt-2">Total Pacientes</h5>
                <p className="display-6 text-primary fw-bold">{totalPacientes}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center border-success mb-3" style={{ borderWidth: '2px' }}>
              <div className="card-body">
                <i className="bi bi-shield-check text-success" style={{ fontSize: '2rem' }}></i>
                <h5 className="card-title mt-2">Seguros DIAE</h5>
                <p className="display-6 text-success fw-bold">{totalDiae}</p>
                <small className="text-muted">{totalPacientes > 0 ? ((totalDiae / totalPacientes) * 100).toFixed(1) : 0}% del total</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center border-info mb-3" style={{ borderWidth: '2px' }}>
              <div className="card-body">
                <i className="bi bi-mortarboard-fill text-info" style={{ fontSize: '2rem' }}></i>
                <h5 className="card-title mt-2">Carreras Diferentes</h5>
                <p className="display-6 text-info fw-bold">{carreras.length}</p>
                {carreras.length > 0 && (
                  <small className="text-muted d-block" style={{ maxHeight: '40px', overflow: 'hidden' }}>
                    {carreras.slice(0, 3).join(', ')}{carreras.length > 3 && '...'}
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Carreras Atendidas */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <h5 className="mb-0">
              <i className="bi bi-bar-chart-fill me-2"></i>
              Pacientes por Carrera
            </h5>
          </div>
          <div className="card-body">
            {datosPorCarrera.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={datosPorCarrera}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="carrera" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#667eea" name="Cantidad de Pacientes" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="alert alert-info">No hay datos de carreras disponibles</div>
            )}
          </div>
        </div>

        {/* Gráfico de Motivos de Consulta */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header" style={{ background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white' }}>
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i>
              Top 10 Motivos de Consulta
            </h5>
          </div>
          <div className="card-body">
            {datosPorMotivo.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={datosPorMotivo} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="motivo" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#764ba2" name="Cantidad de Consultas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="alert alert-info">No hay datos de motivos disponibles</div>
            )}
          </div>
        </div>

        {/* Gráfico de Torta DIAE */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              <i className="bi bi-pie-chart-fill me-2"></i>
              Distribución de Seguros DIAE
            </h5>
          </div>
          <div className="card-body">
            {totalPacientes > 0 ? (
              <div className="row align-items-center">
                <div className="col-md-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={datosDiae}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {datosDiae.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#6b7280'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="col-md-6">
                  <div className="list-group">
                    <div className="list-group-item d-flex justify-content-between align-items-center">
                      <span><i className="bi bi-check-circle text-success me-2"></i>Con DIAE</span>
                      <span className="badge bg-success rounded-pill">{datosDiae[0].value}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center">
                      <span><i className="bi bi-x-circle text-secondary me-2"></i>Sin DIAE</span>
                      <span className="badge bg-secondary rounded-pill">{datosDiae[1].value}</span>
                    </div>
                  </div>
                  <div className="alert alert-info mt-3 mb-0">
                    <strong>Porcentaje DIAE:</strong> {((datosDiae[0].value / totalPacientes) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info">No hay datos disponibles</div>
            )}
          </div>
        </div>

        {/* Gráfico de Insumos con Alerta de Stock Bajo */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-warning text-white">
            <h5 className="mb-0">
              <i className="bi bi-box-seam-fill me-2"></i>
              Stock de Insumos Médicos
            </h5>
          </div>
          <div className="card-body">
            {datosInsumos.length > 0 ? (
              <>
                <div className="alert alert-warning mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Alerta:</strong> Las barras en <span className="text-danger fw-bold">rojo</span> indican insumos con stock ≤ 20%
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={datosInsumos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded shadow-sm">
                              <p className="mb-1"><strong>{data.nombre}</strong></p>
                              <p className="mb-1">Cantidad: <strong>{data.cantidad}</strong></p>
                              <p className="mb-0" style={{ color: data.stockBajo ? '#ef4444' : '#667eea' }}>
                                Stock: <strong>{data.porcentaje}%</strong>
                                {data.stockBajo && <span className="ms-2">⚠️ BAJO</span>}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="cantidad" 
                      name="Cantidad en Stock"
                      fill="#667eea"
                    >
                      {datosInsumos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.stockBajo ? '#ef4444' : '#667eea'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                
                {/* Lista de insumos con stock bajo */}
                {datosInsumos.some(i => i.stockBajo) && (
                  <div className="alert alert-danger mt-3">
                    <h6 className="alert-heading">
                      <i className="bi bi-exclamation-octagon me-2"></i>
                      Insumos con Stock Crítico:
                    </h6>
                    <ul className="mb-0">
                      {datosInsumos.filter(i => i.stockBajo).map((insumo, idx) => (
                        <li key={idx}>
                          <strong>{insumo.nombre}</strong>: {insumo.cantidad} unidades ({insumo.porcentaje}% del stock inicial)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="alert alert-info">No hay datos de insumos disponibles</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}