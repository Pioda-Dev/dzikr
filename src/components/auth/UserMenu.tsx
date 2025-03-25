import { useState } from "react";
import { useAuthContext } from "./AuthContext";
import { t } from "../../lib/i18n";
import { User, LogOut, Wallet, Settings, Heart } from "lucide-react";

interface UserMenuProps {
  onWalletClick?: () => void;
  onDonateClick?: () => void;
  onSettingsClick?: () => void;
}

const UserMenu = ({
  onWalletClick,
  onDonateClick,
  onSettingsClick,
}: UserMenuProps) => {
  const { user, logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const handleWalletClick = () => {
    if (onWalletClick) onWalletClick();
    setIsMenuOpen(false);
  };

  const handleDonateClick = () => {
    if (onDonateClick) onDonateClick();
    setIsMenuOpen(false);
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) onSettingsClick();
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-100"
      >
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
          <span className="text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-slate-200">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-700">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>

          <button
            onClick={handleWalletClick}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
          >
            <Wallet className="h-4 w-4 mr-2 text-slate-500" />
            {t("wallet.title")}
          </button>

          <button
            onClick={handleDonateClick}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
          >
            <Heart className="h-4 w-4 mr-2 text-slate-500" />
            {t("donation.title")}
          </button>

          <button
            onClick={handleSettingsClick}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
          >
            <Settings className="h-4 w-4 mr-2 text-slate-500" />
            {t("settings.title")}
          </button>

          <div className="border-t border-slate-100 mt-1"></div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t("auth.logout")}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
