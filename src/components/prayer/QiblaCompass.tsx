import { useState, useEffect, useRef } from "react";
import { Compass, RefreshCw, Info } from "lucide-react";
import { calculateQiblaDirection } from "../../lib/qibla";
import { LocationData } from "../../lib/prayerTimes";

interface QiblaCompassProps {
  location: LocationData | null;
}

const QiblaCompass = ({ location }: QiblaCompassProps) => {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [currentDirection, setCurrentDirection] = useState<number | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [showManualMode, setShowManualMode] = useState(false);
  const [manualDirection, setManualDirection] = useState<number>(0);
  const [showInfo, setShowInfo] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);
  const orientationListener = useRef<
    ((event: DeviceOrientationEvent) => void) | null
  >(null);

  useEffect(() => {
    if (location) {
      const direction = calculateQiblaDirection(
        location.latitude,
        location.longitude,
      );
      setQiblaDirection(direction);
    }

    // Cleanup function to remove event listener when component unmounts
    return () => {
      if (orientationListener.current) {
        window.removeEventListener(
          "deviceorientation",
          orientationListener.current,
        );
      }
    };
  }, [location]);

  const startCompass = () => {
    setIsCalibrating(true);

    // First, remove any existing listener
    if (orientationListener.current) {
      window.removeEventListener(
        "deviceorientation",
        orientationListener.current,
      );
    }

    // Create a new orientation handler
    orientationListener.current = handleOrientation;

    if (
      window.DeviceOrientationEvent &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      // iOS 13+ requires permission
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === "granted") {
            window.addEventListener(
              "deviceorientation",
              orientationListener.current!,
            );
            setIsCalibrating(false);
          } else {
            alert(
              "Permission to access device orientation was denied. Using manual mode instead.",
            );
            setIsCalibrating(false);
            setShowManualMode(true);
          }
        })
        .catch((error: Error) => {
          console.error(
            "Error requesting device orientation permission:",
            error,
          );
          setIsCalibrating(false);
          setShowManualMode(true);
        });
    } else if (window.DeviceOrientationEvent) {
      // Non-iOS devices or older iOS versions
      window.addEventListener("deviceorientation", orientationListener.current);
      setIsCalibrating(false);
    } else {
      alert(
        "Device orientation is not supported by your browser. Using manual mode instead.",
      );
      setIsCalibrating(false);
      setShowManualMode(true);
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    // Alpha is the compass direction the device is facing in degrees
    if (event.alpha !== null) {
      setCurrentDirection(event.alpha);
    } else {
      // If alpha is null, fall back to manual mode
      setShowManualMode(true);
    }
  };

  // Calculate the rotation needed for the compass needle
  const getCompassRotation = () => {
    if (showManualMode) {
      // In manual mode, use the manual direction
      return qiblaDirection !== null ? qiblaDirection - manualDirection : 0;
    }

    if (currentDirection === null || qiblaDirection === null) {
      return 0;
    }

    // Calculate the difference between current direction and qibla direction
    return qiblaDirection - currentDirection;
  };

  const handleManualRotation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualDirection(Number(e.target.value));
  };

  const toggleManualMode = () => {
    setShowManualMode(!showManualMode);
    if (!showManualMode) {
      // When switching to manual mode, stop the device orientation
      if (orientationListener.current) {
        window.removeEventListener(
          "deviceorientation",
          orientationListener.current,
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between w-full mb-2">
        <h3 className="text-lg font-semibold text-slate-800">
          Qibla Direction
        </h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-slate-500 hover:text-slate-700"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>

      {showInfo && (
        <div className="mb-4 p-3 bg-slate-50 rounded-md text-sm text-slate-600">
          <p>The Qibla compass shows the direction to the Kaaba in Mecca.</p>
          <p className="mt-1">If the compass doesn't work, try:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Enabling location services</li>
            <li>Calibrating your device's compass</li>
            <li>
              Using manual mode if your device doesn't support orientation
            </li>
          </ul>
        </div>
      )}

      <div className="relative w-56 h-56 mb-4" ref={compassRef}>
        {/* Compass background with degree markings */}
        <div className="absolute inset-0 rounded-full border-2 border-slate-300 flex items-center justify-center bg-white">
          {/* Degree markings */}
          {Array.from({ length: 12 }).map((_, i) => {
            const degree = i * 30;
            const radian = (degree - 90) * (Math.PI / 180);
            const x = 28 * Math.cos(radian);
            const y = 28 * Math.sin(radian);
            return (
              <div
                key={i}
                className="absolute text-xs font-medium text-slate-600"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  left: "50%",
                  top: "50%",
                }}
              >
                {degree === 0
                  ? "N"
                  : degree === 90
                    ? "E"
                    : degree === 180
                      ? "S"
                      : degree === 270
                        ? "W"
                        : degree}
              </div>
            );
          })}

          {/* Inner circle */}
          <div className="absolute w-40 h-40 rounded-full border border-slate-200"></div>

          {/* Compass needle */}
          {qiblaDirection !== null &&
          (currentDirection !== null || showManualMode) ? (
            <div
              className="w-1 h-28 bg-gradient-to-t from-emerald-600 to-red-500 rounded-full"
              style={{
                transform: `rotate(${getCompassRotation()}deg)`,
                transformOrigin: "center",
              }}
            >
              <div className="w-4 h-4 rounded-full bg-red-500 absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
              <div className="w-4 h-4 rounded-full bg-emerald-600 absolute -bottom-2 left-1/2 transform -translate-x-1/2"></div>
            </div>
          ) : (
            <div className="text-center">
              <Compass className="w-16 h-16 text-slate-400" />
              <p className="text-sm text-slate-500 mt-2">
                {location ? "Tap to activate compass" : "Set location first"}
              </p>
            </div>
          )}

          {/* Kaaba icon at qibla direction */}
          {qiblaDirection !== null &&
            (currentDirection !== null || showManualMode) && (
              <div
                className="absolute w-6 h-6 bg-black rounded-sm flex items-center justify-center"
                style={{
                  transform: `rotate(${getCompassRotation()}deg) translateY(-70px)`,
                  transformOrigin: "center",
                }}
              >
                <div className="w-4 h-4 border-2 border-emerald-400"></div>
              </div>
            )}
        </div>
      </div>

      {showManualMode && (
        <div className="w-full mb-4">
          <label className="block text-sm text-slate-600 mb-1">
            Manual Direction: {manualDirection}°
          </label>
          <input
            type="range"
            min="0"
            max="359"
            value={manualDirection}
            onChange={handleManualRotation}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0° (N)</span>
            <span>90° (E)</span>
            <span>180° (S)</span>
            <span>270° (W)</span>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        {location && (
          <button
            onClick={startCompass}
            disabled={isCalibrating}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-emerald-300 flex items-center"
          >
            {isCalibrating ? (
              <>
                <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Calibrating...
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 mr-2" />
                {currentDirection === null && !showManualMode
                  ? "Activate Compass"
                  : "Recalibrate"}
              </>
            )}
          </button>
        )}

        <button
          onClick={toggleManualMode}
          className={`px-4 py-2 ${showManualMode ? "bg-slate-700" : "bg-slate-500"} text-white rounded-md hover:bg-slate-600 flex items-center`}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {showManualMode ? "Using Manual" : "Use Manual"}
        </button>
      </div>

      {qiblaDirection !== null && (
        <div className="mt-3 text-center">
          <p className="text-sm text-slate-600">
            Qibla is{" "}
            <span className="font-semibold">{Math.round(qiblaDirection)}°</span>{" "}
            from North
          </p>
          {(currentDirection !== null || showManualMode) && (
            <p className="text-xs text-slate-500 mt-1">
              Point the red tip toward the Kaaba
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QiblaCompass;
