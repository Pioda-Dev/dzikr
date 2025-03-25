import { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Settings,
  Calculator,
  Compass,
  Bell,
  X,
} from "lucide-react";
import {
  fetchPrayerTimes,
  getUserLocation,
  LocationData,
  PrayerTimeData,
  CALCULATION_METHODS,
} from "../../lib/prayerTimes";
import {
  getSavedLocation,
  saveLocation,
  getCalculationMethod,
  getClockSettings,
  saveClockSettings,
} from "../../lib/storage";
import LocationSelector from "../settings/LocationSelector";
import QiblaCompass from "./QiblaCompass";
import ClockSettings, {
  ClockSettings as ClockSettingsType,
} from "./ClockSettings";
import CalculationMethodSelector from "./CalculationMethodSelector";
import PrayerNotifications from "./PrayerNotifications";

export default function PrayerTimesCard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData[]>([
    { name: "Fajr", arabicName: "الفجر", time: "05:30 AM", isNext: false },
    { name: "Sunrise", arabicName: "الشروق", time: "06:45 AM", isNext: false },
    { name: "Dhuhr", arabicName: "الظهر", time: "12:30 PM", isNext: false },
    { name: "Asr", arabicName: "العصر", time: "03:45 PM", isNext: true },
    { name: "Maghrib", arabicName: "المغرب", time: "06:15 PM", isNext: false },
    { name: "Isha", arabicName: "العشاء", time: "07:45 PM", isNext: false },
  ]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [showQiblaCompass, setShowQiblaCompass] = useState(false);
  const [showClockSettings, setShowClockSettings] = useState(false);
  const [showCalculationMethod, setShowCalculationMethod] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [calculationMethod, setCalculationMethod] = useState<number>(3); // Default to Muslim World League
  const [clockSettings, setClockSettings] = useState<ClockSettingsType>({
    fontSize: 24,
    fontFamily: "inherit",
  });

  // Load location, calculation method, and prayer times on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Load calculation method
        const savedMethod = getCalculationMethod();
        if (savedMethod) {
          setCalculationMethod(savedMethod);
        }

        // Load clock settings
        const savedClockSettings = getClockSettings();
        if (savedClockSettings) {
          setClockSettings(savedClockSettings);
        }

        // Try to get saved location first
        const savedLocation = getSavedLocation();

        if (savedLocation) {
          setLocation(savedLocation);
          const times = await fetchPrayerTimes(
            savedLocation,
            calculationMethod,
          );
          setPrayerTimes(times);
        } else {
          // Try to get user's current location
          try {
            const detectedLocation = await getUserLocation();
            setLocation(detectedLocation);
            saveLocation(detectedLocation);

            const times = await fetchPrayerTimes(
              detectedLocation,
              calculationMethod,
            );
            setPrayerTimes(times);
          } catch (error) {
            // If location detection fails, use default prayer times
            console.error("Error detecting location:", error);
            const times = await fetchPrayerTimes(undefined, calculationMethod);
            setPrayerTimes(times);
          }
        }
      } catch (error) {
        console.error("Error loading prayer times:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format current time
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Format current date
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Handle location selection
  const handleLocationSelect = async (newLocation: LocationData) => {
    setLocation(newLocation);
    setIsLoading(true);

    try {
      const times = await fetchPrayerTimes(newLocation, calculationMethod);
      setPrayerTimes(times);
    } catch (error) {
      console.error("Error fetching prayer times for new location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle calculation method selection
  const handleCalculationMethodSelect = async (methodId: number) => {
    setCalculationMethod(methodId);
    setIsLoading(true);

    try {
      if (location) {
        const times = await fetchPrayerTimes(location, methodId);
        setPrayerTimes(times);
      } else {
        const times = await fetchPrayerTimes(undefined, methodId);
        setPrayerTimes(times);
      }
    } catch (error) {
      console.error(
        "Error fetching prayer times for new calculation method:",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clock settings update
  const handleClockSettingsUpdate = (settings: ClockSettingsType) => {
    setClockSettings(settings);
    saveClockSettings(settings);
  };

  // Get the current calculation method name
  const getCurrentMethodName = () => {
    const method = CALCULATION_METHODS.find((m) => m.id === calculationMethod);
    return method ? method.description : "Standard";
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header with current time and date */}
      <div className="bg-emerald-700 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Prayer Times</h2>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span
              style={{
                fontFamily: clockSettings.fontFamily,
                fontSize: `${clockSettings.fontSize}px`,
                lineHeight: 1.2,
              }}
            >
              {formattedTime}
            </span>
            <button
              onClick={() => setShowClockSettings(true)}
              className="ml-2 p-1 rounded-full hover:bg-emerald-600"
              title="Clock Settings"
            >
              <Settings className="h-3 w-3 text-emerald-100" />
            </button>
          </div>
        </div>
        <p className="text-sm text-emerald-100 mt-1">{formattedDate}</p>
      </div>

      {/* Prayer times list */}
      <div className="divide-y divide-slate-100">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
            <p className="mt-2 text-slate-500">Loading prayer times...</p>
          </div>
        ) : (
          prayerTimes.map((prayer) => (
            <div
              key={prayer.name}
              className={`flex items-center justify-between p-4 ${prayer.isNext ? "bg-emerald-50" : ""}`}
            >
              <div className="flex items-center">
                {prayer.isNext && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                )}
                <div>
                  <span
                    className={`font-medium ${prayer.isNext ? "text-emerald-700" : "text-slate-700"}`}
                  >
                    {prayer.name}
                  </span>
                  {prayer.arabicName && (
                    <span className="text-xs block text-slate-500 mt-0.5">
                      {prayer.arabicName}
                    </span>
                  )}
                </div>
              </div>
              <span
                className={`${prayer.isNext ? "text-emerald-700 font-medium" : "text-slate-600"}`}
              >
                {prayer.time}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Calculation method info */}
      <div className="px-4 py-2 bg-slate-100 text-center text-xs text-slate-500 flex justify-between items-center">
        <span>Method: {getCurrentMethodName()}</span>
        <button
          className="text-emerald-600 font-medium"
          onClick={() => setShowCalculationMethod(true)}
        >
          Change
        </button>
      </div>

      {/* Location and Qibla info */}
      <div className="p-4 bg-slate-50 text-center text-sm text-slate-500">
        <div className="flex justify-between items-center">
          <div>
            <p className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {location
                ? `${location.city}, ${location.country}`
                : "Location not set"}
            </p>
            <button
              className="text-emerald-600 font-medium text-xs mt-1"
              onClick={() => setShowLocationSelector(true)}
            >
              Change location
            </button>
          </div>
          <div>
            <p className="flex items-center">
              <Compass className="h-3 w-3 mr-1" />
              Qibla Direction
            </p>
            <button
              className="text-emerald-600 font-medium text-xs mt-1"
              onClick={() => setShowQiblaCompass(true)}
            >
              Show compass
            </button>
          </div>
          <div>
            <p className="flex items-center">
              <Bell className="h-3 w-3 mr-1" />
              Notifications
            </p>
            <button
              className="text-emerald-600 font-medium text-xs mt-1"
              onClick={() => setShowNotifications(true)}
            >
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Location selector modal */}
      {showLocationSelector && (
        <LocationSelector
          onClose={() => setShowLocationSelector(false)}
          onSelect={handleLocationSelect}
        />
      )}

      {/* Qibla compass modal */}
      {showQiblaCompass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">
                Qibla Direction
              </h2>
              <button
                onClick={() => setShowQiblaCompass(false)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4">
              <QiblaCompass location={location} />
            </div>
          </div>
        </div>
      )}

      {/* Clock settings modal */}
      {showClockSettings && (
        <ClockSettings
          onClose={() => setShowClockSettings(false)}
          onApply={handleClockSettingsUpdate}
        />
      )}

      {/* Calculation method selector modal */}
      {showCalculationMethod && (
        <CalculationMethodSelector
          onClose={() => setShowCalculationMethod(false)}
          onSelect={handleCalculationMethodSelect}
        />
      )}

      {/* Prayer notifications modal */}
      {showNotifications && (
        <PrayerNotifications onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
}
