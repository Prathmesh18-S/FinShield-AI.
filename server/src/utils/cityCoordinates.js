const CITY_COORDINATES = {
  // Indian Cities
  mumbai: { lat: 19.0760, lng: 72.8777 },
  delhi: { lat: 28.7041, lng: 77.1025 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  
  // International Cities
  london: { lat: 51.5074, lng: -0.1278 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  sydney: { lat: -33.8688, lng: 151.2093 },
  frankfurt: { lat: 50.1109, lng: 8.6821 },
  'hong kong': { lat: 22.3193, lng: 114.1694 },
  toronto: { lat: 43.6510, lng: -79.3470 },
  paris: { lat: 48.8566, lng: 2.3522 }
};

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 *
 * @param {string} city1 - The name of the first city
 * @param {string} city2 - The name of the second city
 * @returns {number|null} Distance in kilometers, or null if a city is not found
 */
const getDistanceKm = (city1, city2) => {
  if (!city1 || !city2) return null;

  const c1 = CITY_COORDINATES[city1.toLowerCase().trim()];
  const c2 = CITY_COORDINATES[city2.toLowerCase().trim()];

  if (!c1 || !c2) return null;

  const toRadians = (degree) => degree * (Math.PI / 180);

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(c2.lat - c1.lat);
  const dLon = toRadians(c2.lng - c1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(c1.lat)) * Math.cos(toRadians(c2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Determines if travel between two cities in the given time gap is impossible.
 * Assumes a maximum realistic travel speed of 900 km/h (typical commercial flight).
 *
 * @param {string} city1 - First city name
 * @param {string} city2 - Second city name
 * @param {number} timeGapMinutes - Time difference between events in minutes
 * @returns {boolean} true if travel is impossible, false otherwise (or if data is missing)
 */
const isImpossibleTravel = (city1, city2, timeGapMinutes) => {
  if (!city1 || !city2 || typeof timeGapMinutes !== 'number' || timeGapMinutes <= 0) {
    return false;
  }

  // Same city is always possible travel theoretically (distance is 0)
  if (city1.toLowerCase().trim() === city2.toLowerCase().trim()) {
    return false;
  }

  const distanceKm = getDistanceKm(city1, city2);
  
  if (distanceKm === null) {
    return false; // Can't determine
  }

  const MAX_SPEED_KMH = 900;
  
  // Convert time gap to hours
  const timeGapHours = timeGapMinutes / 60;
  
  // Calculate required speed
  const requiredSpeedKmh = distanceKm / timeGapHours;
  
  // If required speed exceeds max realistic speed, travel is impossible
  return requiredSpeedKmh > MAX_SPEED_KMH;
};

module.exports = {
  CITY_COORDINATES,
  getDistanceKm,
  isImpossibleTravel
};
