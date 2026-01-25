import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle, AlertCircle, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

const mockNotifications = [
  {
    id: "1",
    title: "Scan Complete",
    message: "Found 12 duplicate files in your library",
    type: "success",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "Storage Alert",
    message: "You can free up 2.4 GB by removing duplicates",
    type: "warning",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Cleanup Complete",
    message: "Successfully removed duplicate files",
    type: "success",
    time: "Yesterday",
    read: true,
  },
];

/**
 * @param {Object} notification
 * @param {string} notification.id
 * @param {string} notification.title
 * @param {string} notification.message
 * @param {"success" | "warning" | "info"} notification.type
 * @param {string} notification.time
 * @param {boolean} notification.read
 */
const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const panelRef = useRef(null);
  const audioRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp6ciHRiVFdnfI2eoJiHdGNWVWF0iJmknpOBcGNaXW6Fmaaml4d0Y1pdaX+WpqacjHhoYGFvhpqoppuNfnFmYmZzhZmlpZmOfnJoZGpzhJijopeLfnNqZ2xzhZagn5SIfnRram91hJSdm5OHfnVtbHB0g5GamZGFfndvcnN2gY+Wlo+CfXhxdHZ4f4yTkot/fHlzdnh5fomQjoiAfXp1d3l5fYeMi4Z+fHt3eXp6fIWJh4N9fHt4enp7fIOGhIF9fHt5e3t7fIGDgX99fXt6fHx8fH+Af359fXx7fX19fX1+fn59fX18fX5+fn5+fn59fX19fn5/f39/f39+fn5+f39/f4CAgICAgICAf39/f4CAgICAgYGBgYGBgYCAgICBgYGBgYKCgoKCgoKBgYGBgoKCgoKCg4ODg4ODgoKCgoODg4ODg4SEhISEhIODg4OEhISEhISFhYWFhYWEhISEhYWFhYWFhYaGhoaGhYWFhYaGhoaGhoaHh4eHh4aGhoaHh4eHh4eHiIiIiIiHh4eHiIiIiIiIiImJiYmJiIiIiImJiYmJiYmKioqKioqJiYmJioqKioqKi4uLi4uLioqKiouLi4uLi4yMjIyMjIuLi4uMjIyMjIyNjY2NjY2MjIyMjY2NjY2Njo6Ojo6OjY2NjY6Ojo6Oj4+Pj4+Pjo6Ojo+Pj4+Pj5CQkJCQkI+Pj4+QkJCQkJCRkZGRkZGQkJCQkZGRkZGRkpKSkpKSkZGRkZKSkpKSkpOTk5OTk5KSkpKTk5OTk5OUlJSUlJSTk5OTlJSUlJSUlZWVlZWVlJSUlJWVlZWVlZaWlpaWlpWVlZWWlpaWlpaXl5eXl5eWlpaWl5eXl5eXmJiYmJiYl5eXl5iYmJiYmJmZmZmZmZiYmJiZmZmZmZmampqampqZmZmZmpqampqam5ubm5ubmpqamg==");
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      playSound();
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          onClick={togglePanel}
        >
          <motion.div
            animate={isOpen ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Bell className="w-5 h-5" />
          </motion.div>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute right-0 top-12 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground h-7"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer group ${
                        !notification.read ? "bg-primary/5" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                            </motion.button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;