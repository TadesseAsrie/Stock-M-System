import React from "react";

const Table = ({ children, className = "" }) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}
      >
        {children}
      </table>
    </div>
  );
};

export const Thead = ({ children }) => {
  return <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>;
};

export const Tbody = ({ children }) => {
  return (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
      {children}
    </tbody>
  );
};

export const Tr = ({ children, className = "" }) => {
  return <tr className={className}>{children}</tr>;
};

export const Th = ({ children, className = "" }) => {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
};

export const Td = ({ children, className = "" }) => {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 ${className}`}
    >
      {children}
    </td>
  );
};

export default Table;
