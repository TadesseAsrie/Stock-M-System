import React from "react";
import { IoFolderOpen } from "react-icons/io5";

const EmptyState = ({
  title = "No data found",
  description = "Try adjusting your search or filter to find what you're looking for.",
  icon: Icon = IoFolderOpen,
}) => {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
