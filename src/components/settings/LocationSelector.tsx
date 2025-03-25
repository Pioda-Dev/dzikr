import { useState, useEffect } from "react";
import { X, MapPin, Loader2, Search } from "lucide-react";
import { getUserLocation, LocationData } from "../../lib/prayerTimes";
import { saveLocation, getSavedLocation } from "../../lib/storage";
import axios from "axios";

interface LocationSelectorProps {
  onClose: () => void;
  onSelect: (location: LocationData) => void;
}

interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

const LocationSelector = ({ onClose, onSelect }: LocationSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState("");
  const [manualCountry, setManualCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);

  useEffect(() => {
    // Load saved location if available
    const savedLocation = getSavedLocation();
    if (savedLocation) {
      setManualCity(savedLocation.city || "");
      setManualCountry(savedLocation.country || "");
    }
  }, []);

  const handleDetectLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await getUserLocation();
      saveLocation(location);
      onSelect(location);
      onClose();
    } catch (err) {
      setError("Could not detect your location. Please enter it manually.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLocation = () => {
    if (!manualCity || !manualCountry) {
      setError("Please enter both city and country");
      return;
    }

    // For manual location, we use a geocoding service in a real app
    // Here we'll just use a placeholder location with the entered names
    const location: LocationData = {
      city: manualCity,
      country: manualCountry,
      // Default coordinates (will be replaced with actual geocoding in a real app)
      latitude: 21.4225,
      longitude: 39.8262, // Mecca coordinates as default
    };

    saveLocation(location);
    onSelect(location);
    onClose();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            "User-Agent": "DigitalTasbihApp/1.0",
          },
        },
      );

      if (response.data && response.data.length > 0) {
        setSearchResults(response.data.slice(0, 5)); // Limit to 5 results
      } else {
        setSearchResults([]);
        setError("No locations found. Try a different search term.");
      }
    } catch (err) {
      console.error("Error searching for location:", err);
      setError("Error searching for location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = async (result: GeocodingResult) => {
    try {
      // Get detailed information about the selected location
      const detailResponse = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${result.lat}&lon=${result.lon}`,
        {
          headers: {
            "User-Agent": "DigitalTasbihApp/1.0",
          },
        },
      );

      const address = detailResponse.data.address;
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.state ||
        "Unknown";
      const country = address.country || "Unknown";

      const location: LocationData = {
        city,
        country,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      };

      saveLocation(location);
      onSelect(location);
      onClose();
    } catch (err) {
      console.error("Error getting location details:", err);
      setError("Error processing location. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Set Your Location
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-slate-600 mb-4">
            Your location is used to calculate accurate prayer times for your
            area.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleDetectLocation}
            disabled={isLoading}
            className="w-full py-3 mb-4 flex items-center justify-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-emerald-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Detect My Location
              </>
            )}
          </button>

          <div className="mb-4">
            <div className="relative mb-3">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a location..."
                  className="w-full p-3 border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-4 bg-emerald-600 text-white rounded-r-md hover:bg-emerald-700 disabled:bg-emerald-300 flex items-center justify-center"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="mb-4 border border-slate-200 rounded-md overflow-hidden">
                <div className="text-xs font-medium text-slate-500 p-2 bg-slate-50 border-b border-slate-200">
                  Search Results
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSearchResult(result)}
                      className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                    >
                      <p className="text-sm font-medium text-slate-700">
                        {result.display_name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs font-medium text-slate-500 mb-2 mt-4">
              Or enter location manually:
            </div>

            <div className="relative mb-3">
              <input
                type="text"
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                placeholder="City"
                className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="relative">
              <input
                type="text"
                value={manualCountry}
                onChange={(e) => setManualCountry(e.target.value)}
                placeholder="Country"
                className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={handleManualLocation}
            className="w-full py-3 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
          >
            Set Manual Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
