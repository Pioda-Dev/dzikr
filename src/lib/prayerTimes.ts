import axios from "axios";

export interface PrayerTimeData {
  name: string;
  time: string;
  isNext: boolean;
  arabicName?: string;
}

export interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export type CalculationMethod = {
  id: number;
  name: string;
  description: string;
};

// Available calculation methods
export const CALCULATION_METHODS: CalculationMethod[] = [
  {
    id: 1,
    name: "University of Islamic Sciences, Karachi",
    description: "Fiqh Hanafi",
  },
  { id: 2, name: "Islamic Society of North America", description: "ISNA" },
  { id: 3, name: "Muslim World League", description: "MWL" },
  { id: 4, name: "Umm al-Qura University, Makkah", description: "Umm al-Qura" },
  { id: 5, name: "Egyptian General Authority of Survey", description: "Egypt" },
  {
    id: 7,
    name: "Institute of Geophysics, University of Tehran",
    description: "Tehran",
  },
  { id: 8, name: "Gulf Region", description: "Gulf" },
  { id: 9, name: "Kuwait", description: "Kuwait" },
  { id: 10, name: "Qatar", description: "Qatar" },
  { id: 11, name: "Majlis Ugama Islam Singapura", description: "Singapore" },
  {
    id: 12,
    name: "Union des organisations islamiques de France",
    description: "France",
  },
  { id: 13, name: "Diyanet İşleri Başkanlığı", description: "Turkey" },
  {
    id: 14,
    name: "Spiritual Administration of Muslims of Russia",
    description: "Russia",
  },
  {
    id: 15,
    name: "Moonsighting Committee Worldwide",
    description: "Moonsighting",
  },
];

// Default location if user doesn't provide one
const DEFAULT_LOCATION: LocationData = {
  city: "Jakarta",
  country: "Indonesia",
  latitude: -6.2088,
  longitude: 106.8456,
};

// Get prayer times from Aladhan API
export const fetchPrayerTimes = async (
  location: LocationData = DEFAULT_LOCATION,
  method: number = 3, // Default to Muslim World League
): Promise<PrayerTimeData[]> => {
  try {
    const { latitude, longitude } = location;
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    const response = await axios.get(
      `https://api.aladhan.com/v1/timings/${formattedDate}`,
      {
        params: {
          latitude,
          longitude,
          method, // Use the provided calculation method
          adjustment: 1, // Adjustment for higher latitudes
        },
      },
    );

    if (response.data && response.data.data && response.data.data.timings) {
      const timings = response.data.data.timings;

      // Extract the five daily prayers with Arabic names
      const prayerTimesData = [
        {
          name: "Fajr",
          arabicName: "الفجر",
          time: formatTime(timings.Fajr),
          isNext: false,
        },
        {
          name: "Sunrise",
          arabicName: "الشروق",
          time: formatTime(timings.Sunrise),
          isNext: false,
        },
        {
          name: "Dhuhr",
          arabicName: "الظهر",
          time: formatTime(timings.Dhuhr),
          isNext: false,
        },
        {
          name: "Asr",
          arabicName: "العصر",
          time: formatTime(timings.Asr),
          isNext: false,
        },
        {
          name: "Maghrib",
          arabicName: "المغرب",
          time: formatTime(timings.Maghrib),
          isNext: false,
        },
        {
          name: "Isha",
          arabicName: "العشاء",
          time: formatTime(timings.Isha),
          isNext: false,
        },
      ];

      // Determine which prayer is next
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      let nextPrayerIndex = -1;
      for (let i = 0; i < prayerTimesData.length; i++) {
        const prayerTime = prayerTimesData[i].time;
        const [hours, minutes] = prayerTime
          .split(":")[0]
          .split(" ")[0]
          .split(":")
          .map(Number);
        const period = prayerTime.includes("PM") ? "PM" : "AM";
        let hoursIn24 = hours;

        if (period === "PM" && hours !== 12) {
          hoursIn24 = hours + 12;
        } else if (period === "AM" && hours === 12) {
          hoursIn24 = 0;
        }

        const prayerTimeInMinutes = hoursIn24 * 60 + minutes;

        if (prayerTimeInMinutes > currentTime) {
          nextPrayerIndex = i;
          break;
        }
      }

      // If no prayer is found for today (all prayers have passed), set the first prayer as next
      if (nextPrayerIndex === -1) {
        nextPrayerIndex = 0;
      }

      prayerTimesData[nextPrayerIndex].isNext = true;

      return prayerTimesData;
    }

    throw new Error("Failed to parse prayer times data");
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    // Return default prayer times if API fails
    return [
      { name: "Fajr", arabicName: "الفجر", time: "05:30 AM", isNext: false },
      {
        name: "Sunrise",
        arabicName: "الشروق",
        time: "06:45 AM",
        isNext: false,
      },
      { name: "Dhuhr", arabicName: "الظهر", time: "12:30 PM", isNext: false },
      { name: "Asr", arabicName: "العصر", time: "03:45 PM", isNext: true },
      {
        name: "Maghrib",
        arabicName: "المغرب",
        time: "06:15 PM",
        isNext: false,
      },
      { name: "Isha", arabicName: "العشاء", time: "07:45 PM", isNext: false },
    ];
  }
};

// Helper function to format time from 24h to 12h format
export const formatTime = (time24h: string): string => {
  const [hours, minutes] = time24h.split(":");
  const hoursNum = parseInt(hours, 10);

  // Convert to 12-hour format
  const period = hoursNum >= 12 ? "PM" : "AM";
  const hours12 = hoursNum % 12 || 12;

  return `${hours12}:${minutes} ${period}`;
};

// Get user's current location
export const getUserLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Try to get city and country from reverse geocoding
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                headers: {
                  "User-Agent": "DigitalTasbihApp/1.0",
                },
              },
            );

            const address = response.data.address;
            const city =
              address.city || address.town || address.village || "Unknown";
            const country = address.country || "Unknown";

            resolve({
              city,
              country,
              latitude,
              longitude,
            });
          } catch (error) {
            // If reverse geocoding fails, just use coordinates
            resolve({
              city: "Unknown",
              country: "Unknown",
              latitude,
              longitude,
            });
          }
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
};
