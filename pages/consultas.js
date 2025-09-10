export default function ConsultasPage() {
  return (
    <div className="container mt-5">
      <div className="bg-white rounded shadow p-4">
        <h2 className="mb-4 text-info">Consultas Realizadas</h2>
        <form className="row g-3 mb-3">
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="RUT" />
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" placeholder="Fecha" />
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Carrera" />
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Motivo Consulta" />
          </div>
          <div className="col-md-12">
            <button className="btn btn-info w-100" type="submit">Filtrar</button>
          </div>
        </form>
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Fecha</th>
              <th>Carrera</th>
              <th>Motivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Aquí se listarán las consultas */}
            <tr>
              <td>Ejemplo Paciente</td>
              <td>12345678-9</td>
              <td>2024-06-01</td>
              <td>Medicina</td>
              <td>Dolor de cabeza</td>
              <td><button className="btn btn-secondary btn-sm">Ver Ficha</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}