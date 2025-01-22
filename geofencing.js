const turf = require("@turf/turf");

/**
 * Checks if the given point is within the allowed radius from the office location.
 * @param {Object} office - The office location { latitude, longitude }.
 * @param {Object} userLocation - The user's location { latitude, longitude }.
 * @param {number} radius - The allowed radius in meters.
 * @returns {boolean} - True if the user is within the radius, false otherwise.
 */
const isWithinGeofence = (office, userLocation, radius) => {
  const officePoint = turf.point([office.longitude, office.latitude]);
  const userPoint = turf.point([userLocation.longitude, userLocation.latitude]);

  // Calculate distance between points in meters
  const distance = turf.distance(officePoint, userPoint, { units: "meters" });

  return distance <= radius;
};

module.exports = { isWithinGeofence };
