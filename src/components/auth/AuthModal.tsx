import { useState } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { t } from "../../lib/i18n";

type AuthView = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialView?: AuthView;
}

const AuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialView = "login",
}: AuthModalProps) => {
  const [view, setView] = useState<AuthView>(initialView);

  if (!isOpen) return null;

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            {view === "login" ? t("auth.login") : t("auth.signup")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4">
          {view === "login" ? (
            <LoginForm
              onSuccess={handleSuccess}
              onRegisterClick={() => setView("register")}
            />
          ) : (
            <RegisterForm
              onSuccess={handleSuccess}
              onLoginClick={() => setView("login")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
