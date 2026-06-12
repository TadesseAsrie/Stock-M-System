import React from "react";
import { format } from "date-fns";
import Card, { CardHeader, CardBody } from "../ui/Card";
import { IoAddCircle, IoRefresh, IoPeople, IoTicket } from "react-icons/io5";

const RecentActivities = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case "product":
        return <IoAddCircle className="w-5 h-5 text-green-500" />;
      case "stock":
        return <IoRefresh className="w-5 h-5 text-blue-500" />;
      case "supplier":
        return <IoPeople className="w-5 h-5 text-purple-500" />;
      case "purchase":
        return <IoTicket className="w-5 h-5 text-orange-500" />;
      default:
        return <IoAddCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activities
        </h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0">{getIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(activity.date), "MMM dd, yyyy hh:mm a")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default RecentActivities;
