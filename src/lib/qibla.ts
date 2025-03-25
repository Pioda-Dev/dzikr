// Calculate Qibla direction based on user's coordinates
export const calculateQiblaDirection = (
  latitude: number,
  longitude: number,
): number => {
  // Coordinates of the Kaaba in Mecca
  const kaabaLatitude = 21.4225;
  const kaabaLongitude = 39.8262;

  // Convert all angles to radians
  const lat1 = (latitude * Math.PI) / 180;
  const lat2 = (kaabaLatitude * Math.PI) / 180;
  const longDiff = ((kaabaLongitude - longitude) * Math.PI) / 180;

  // Calculate the qibla direction
  const y = Math.sin(longDiff);
  const x =
    Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(longDiff);
  let qiblaDirection = Math.atan2(y, x);

  // Convert from radians to degrees
  qiblaDirection = (qiblaDirection * 180) / Math.PI;

  // Normalize to 0-360 degrees
  qiblaDirection = (qiblaDirection + 360) % 360;

  return qiblaDirection;
};
