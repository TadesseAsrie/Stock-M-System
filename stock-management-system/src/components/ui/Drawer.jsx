import React from "react";
import { IoClose } from "react-icons/io5";

const Drawer = ({ isOpen, onClose, title, children, position = "right" }) => {
  if (!isOpen) return null;

  const positions = {
    right: "right-0",
    left: "left-0",
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div
        className={`fixed top-0 ${positions[position]} h-full w-96 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 animate-slide-in`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-full pb-20">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
