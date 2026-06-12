import React from "react";
import { useApp } from "../context/AppContext";
import { useToast } from "../hooks/useToast";
import { formatDateTime } from "../utils/helpers";
import Card, { CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { IoCheckmark, IoTrash } from "react-icons/io5";

const NotificationsList = () => {
  const { notifications, dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();

  const markAsRead = (id) => {
    dispatch({ type: ACTIONS.MARK_NOTIFICATION_READ, payload: id });
    addToast("Notification marked as read", "success");
  };

  const deleteNotification = (id) => {
    dispatch({ type: ACTIONS.DELETE_NOTIFICATION, payload: id });
    addToast("Notification deleted", "success");
  };

  const markAllAsRead = () => {
    notifications.forEach((n) => {
      if (!n.read)
        dispatch({ type: ACTIONS.MARK_NOTIFICATION_READ, payload: n.id });
    });
    addToast("All notifications marked as read", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-500">Manage alerts and updates</p>
        </div>
        {notifications.length > 0 && (
          <Button variant="secondary" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="No notifications" />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`${!notif.read ? "border-l-4 border-l-primary-500" : ""}`}
            >
              <CardBody className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge
                      color={
                        notif.type === "low_stock"
                          ? "yellow"
                          : notif.type === "out_of_stock"
                            ? "red"
                            : "blue"
                      }
                    >
                      {notif.type.replace("_", " ")}
                    </Badge>
                    {!notif.read && (
                      <span className="text-xs text-primary-600">New</span>
                    )}
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateTime(notif.createdAt)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-green-600 hover:text-green-800"
                    disabled={notif.read}
                  >
                    <IoCheckmark />
                  </button>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <IoTrash />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
