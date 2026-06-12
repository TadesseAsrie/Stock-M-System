import React from "react";
import {
  IoInformationCircle,
  IoCheckmarkCircle,
  IoWarning,
  IoCloseCircle,
} from "react-icons/io5";

const Alert = ({ type = "info", message, onClose }) => {
  const types = {
    info: { icon: IoInformationCircle, color: "blue" },
    success: { icon: IoCheckmarkCircle, color: "green" },
    warning: { icon: IoWarning, color: "yellow" },
    error: { icon: IoCloseCircle, color: "red" },
  };

  const { icon: Icon, color } = types[type];
  const bgColor = {
    blue: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
    green:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
    yellow:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
    red: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border ${bgColor[color]}`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5" />
        <span className="text-sm">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <IoCloseCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
