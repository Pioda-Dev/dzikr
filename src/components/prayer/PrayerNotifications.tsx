import { useState, useEffect } from "react";
import { Bell, BellOff, X, Clock, Settings } from "lucide-react";
import { t } from "../../lib/i18n";

interface PrayerNotificationsProps {
  onClose: () => void;
}

interface NotificationSetting {
  prayer: string;
  enabled: boolean;
  minutesBefore: number;
}

const PrayerNotifications = ({ onClose }: PrayerNotificationsProps) => {
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const [notificationsPermission, setNotificationsPermission] = useState<
    "granted" | "denied" | "default"
  >("default");
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { prayer: "Fajr", enabled: true, minutesBefore: 15 },
    { prayer: "Dhuhr", enabled: true, minutesBefore: 10 },
    { prayer: "Asr", enabled: true, minutesBefore: 10 },
    { prayer: "Maghrib", enabled: true, minutesBefore: 5 },
    { prayer: "Isha", enabled: true, minutesBefore: 10 },
  ]);

  useEffect(() => {
    // Check if notifications are supported
    if ("Notification" in window) {
      setNotificationsSupported(true);
      setNotificationsPermission(Notification.permission);

      // Load saved settings
      const savedSettings = localStorage.getItem(
        "prayer-notification-settings",
      );
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error("Error parsing saved notification settings:", error);
        }
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!notificationsSupported) return;

    try {
      const permission = await Notification.requestPermission();
      setNotificationsPermission(permission);
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const togglePrayerNotification = (prayerName: string) => {
    const updatedSettings = settings.map((setting) => {
      if (setting.prayer === prayerName) {
        return { ...setting, enabled: !setting.enabled };
      }
      return setting;
    });

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const updateMinutesBefore = (prayerName: string, minutes: number) => {
    const updatedSettings = settings.map((setting) => {
      if (setting.prayer === prayerName) {
        return { ...setting, minutesBefore: minutes };
      }
      return setting;
    });

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const saveSettings = (updatedSettings: NotificationSetting[]) => {
    localStorage.setItem(
      "prayer-notification-settings",
      JSON.stringify(updatedSettings),
    );
  };

  const enableAllNotifications = () => {
    const updatedSettings = settings.map((setting) => ({
      ...setting,
      enabled: true,
    }));
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const disableAllNotifications = () => {
    const updatedSettings = settings.map((setting) => ({
      ...setting,
      enabled: false,
    }));
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-emerald-700 text-white">
          <h2 className="text-lg font-semibold flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            {t("prayer.notifications")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {!notificationsSupported ? (
            <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md mb-4">
              {t("prayer.notificationsNotSupported")}
            </div>
          ) : notificationsPermission !== "granted" ? (
            <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-md mb-4 text-center">
              <p className="mb-3">{t("prayer.enableNotifications")}</p>
              <button
                onClick={requestPermission}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                {t("prayer.allowNotifications")}
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <button
                  onClick={enableAllNotifications}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm flex items-center"
                >
                  <Bell className="h-4 w-4 mr-1" />
                  {t("prayer.enableAll")}
                </button>
                <button
                  onClick={disableAllNotifications}
                  className="px-3 py-1.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 text-sm flex items-center"
                >
                  <BellOff className="h-4 w-4 mr-1" />
                  {t("prayer.disableAll")}
                </button>
              </div>

              <div className="space-y-3">
                {settings.map((setting) => (
                  <div
                    key={setting.prayer}
                    className="p-3 border border-slate-200 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            togglePrayerNotification(setting.prayer)
                          }
                          className={`p-1 rounded-full mr-2 ${setting.enabled ? "text-emerald-600" : "text-slate-400"}`}
                        >
                          {setting.enabled ? (
                            <Bell className="h-5 w-5" />
                          ) : (
                            <BellOff className="h-5 w-5" />
                          )}
                        </button>
                        <span className="font-medium text-slate-800">
                          {t(`prayer.${setting.prayer.toLowerCase()}`)}
                        </span>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${setting.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}
                      >
                        {setting.enabled
                          ? t("prayer.enabled")
                          : t("prayer.disabled")}
                      </div>
                    </div>

                    {setting.enabled && (
                      <div className="flex items-center mt-2 pl-8">
                        <Clock className="h-4 w-4 text-slate-500 mr-2" />
                        <span className="text-sm text-slate-600 mr-2">
                          {t("prayer.notifyBefore")}:
                        </span>
                        <select
                          value={setting.minutesBefore}
                          onChange={(e) =>
                            updateMinutesBefore(
                              setting.prayer,
                              Number(e.target.value),
                            )
                          }
                          className="text-sm p-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="5">5 {t("prayer.minutes")}</option>
                          <option value="10">10 {t("prayer.minutes")}</option>
                          <option value="15">15 {t("prayer.minutes")}</option>
                          <option value="30">30 {t("prayer.minutes")}</option>
                          <option value="60">1 {t("prayer.hour")}</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-md text-sm text-slate-600">
                <p className="flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-slate-500" />
                  {t("prayer.notificationsInfo")}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerNotifications;
