/**
 * Servicio para consumir la API de farmacias de turno del MINSAL
 */

const PHARMACY_API_URL = 'https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php';

/**
 * Obtiene la lista de farmacias de turno
 * @returns {Promise<Array>} Lista de farmacias con su información
 */
export const getPharmaciesOnDuty = async () => {
  try {
    const response = await fetch(PHARMACY_API_URL);
    
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener farmacias de turno:', error);
    throw error;
  }
};

/**
 * Filtra farmacias por comuna
 * @param {Array} pharmacies - Lista de farmacias
 * @param {string} comuna - Nombre de la comuna
 * @returns {Array} Farmacias filtradas
 */
export const filterPharmaciesByCommune = (pharmacies, comuna) => {
  if (!comuna) return pharmacies;
  return pharmacies.filter(pharmacy => 
    pharmacy.comuna?.toLowerCase().includes(comuna.toLowerCase())
  );
};

/**
 * Ordena farmacias por nombre
 * @param {Array} pharmacies - Lista de farmacias
 * @returns {Array} Farmacias ordenadas
 */
export const sortPharmaciesByName = (pharmacies) => {
  return [...pharmacies].sort((a, b) => 
    (a.local_nombre || '').localeCompare(b.local_nombre || '')
  );
};
