import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, X, HelpCircle } from "lucide-react";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info" | "confirm";
  duration?: number;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
  onConfirm,
  onCancel,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (type === "confirm") return; 

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, type]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    handleClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    handleClose();
  };

  if (!isVisible) return null;

  const config = {
    success: {
      icon: <CheckCircle className="h-5 w-5" />,
      borderColor: "border-black",
      iconColor: "text-black",
    },
    error: {
      icon: <XCircle className="h-5 w-5" />,
      borderColor: "border-red-500",
      iconColor: "text-red-500",
    },
    info: {
      icon: <AlertCircle className="h-5 w-5" />,
      borderColor: "border-gray-400",
      iconColor: "text-gray-600",
    },
    confirm: {
      icon: <HelpCircle className="h-5 w-5" />,
      borderColor: "border-blue-500",
      iconColor: "text-blue-500",
    },
  };

  const currentConfig = config[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex flex-col gap-3 rounded-lg border-2 ${currentConfig.borderColor} bg-white px-4 py-3 shadow-xl transition-all duration-300 ${
        isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
      style={{ minWidth: "320px", maxWidth: "420px" }}
    >
      <div className="flex items-center gap-3">
        <div className={currentConfig.iconColor}>{currentConfig.icon}</div>
        <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
        <button
          onClick={handleClose}
          className="text-gray-400 transition hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {type === "confirm" && (
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-1.5 text-sm rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Ya
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
