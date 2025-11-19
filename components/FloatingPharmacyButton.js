import { useState, useEffect } from 'react';
import { getPharmaciesOnDuty, sortPharmaciesByName } from '../services/pharmacyService';

export default function FloatingPharmacyButton() {
  const [isMounted, setIsMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Asegurar que el componente solo se renderice en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (showModal && pharmacies.length === 0) {
      fetchPharmacies();
    }
  }, [showModal]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = pharmacies.filter(pharmacy =>
        pharmacy.local_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.comuna_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.localidad_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.local_direccion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPharmacies(filtered);
    } else {
      setFilteredPharmacies(pharmacies);
    }
  }, [searchTerm, pharmacies]);

  const fetchPharmacies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPharmaciesOnDuty();
      const sortedData = sortPharmaciesByName(data);
      setPharmacies(sortedData);
      setFilteredPharmacies(sortedData);
    } catch (err) {
      setError('Error al cargar las farmacias de turno');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSearchTerm('');
  };

  // No renderizar nada hasta que el componente esté montado en el cliente
  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Botón Flotante */}
      <button
        className="floating-pharmacy-btn"
        onClick={handleOpenModal}
        title="Farmacias de Turno"
        aria-label="Ver farmacias de turno"
      >
        <i className="bi bi-capsule"></i>
        <span className="pulse-ring"></span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="bi bi-capsule me-2"></i>
                Farmacias de Turno
              </h2>
              <button className="btn-close" onClick={handleCloseModal} aria-label="Cerrar">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* Buscador */}
              <div className="search-box mb-3">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Buscar por nombre, comuna o dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Contenido */}
              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-3">Cargando farmacias de turno...</p>
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchPharmacies}>
                    Reintentar
                  </button>
                </div>
              )}

              {!loading && !error && filteredPharmacies.length === 0 && pharmacies.length > 0 && (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  No se encontraron farmacias con ese criterio de búsqueda.
                </div>
              )}

              {!loading && !error && filteredPharmacies.length === 0 && pharmacies.length === 0 && (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  No hay farmacias de turno disponibles en este momento.
                </div>
              )}

              {!loading && !error && filteredPharmacies.length > 0 && (
                <>
                  <div className="mb-3 text-muted">
                    <small>Mostrando {filteredPharmacies.length} de {pharmacies.length} farmacias</small>
                  </div>
                  <div className="pharmacy-list">
                    {filteredPharmacies.map((pharmacy, index) => (
                      <div key={index} className="pharmacy-card">
                        <div className="pharmacy-header">
                          <h5 className="pharmacy-name">
                            <i className="bi bi-shop me-2"></i>
                            {pharmacy.local_nombre || 'Sin nombre'}
                          </h5>
                          {pharmacy.local_telefono && (
                            <a 
                              href={`tel:${pharmacy.local_telefono}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <i className="bi bi-telephone"></i>
                            </a>
                          )}
                        </div>
                        
                        <div className="pharmacy-info">
                          <div className="info-item">
                            <i className="bi bi-geo-alt"></i>
                            <span>
                              {pharmacy.local_direccion || 'Sin dirección'}
                            </span>
                          </div>
                          
                          {pharmacy.comuna_nombre && (
                            <div className="info-item">
                              <i className="bi bi-pin-map"></i>
                              <span>
                                {pharmacy.localidad_nombre ? 
                                  `${pharmacy.localidad_nombre}, ${pharmacy.comuna_nombre}` : 
                                  pharmacy.comuna_nombre
                                }
                              </span>
                            </div>
                          )}

                          {pharmacy.local_telefono && (
                            <div className="info-item">
                              <i className="bi bi-telephone"></i>
                              <span>{pharmacy.local_telefono}</span>
                            </div>
                          )}

                          {pharmacy.funcionamiento_hora_apertura && pharmacy.funcionamiento_hora_cierre && (
                            <div className="info-item">
                              <i className="bi bi-clock"></i>
                              <span>
                                {pharmacy.funcionamiento_hora_apertura} - {pharmacy.funcionamiento_hora_cierre}
                              </span>
                            </div>
                          )}
                        </div>

                        {pharmacy.local_lat && pharmacy.local_lng && (
                          <div className="pharmacy-actions">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.local_lat},${pharmacy.local_lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-success"
                            >
                              <i className="bi bi-map me-1"></i>
                              Ver en mapa
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
