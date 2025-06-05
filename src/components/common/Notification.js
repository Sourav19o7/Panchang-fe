import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Notification = ({
  id,
  type = 'info', // success, error, warning, info
  title,
  message,
  duration = 5000,
  onClose,
  showCloseButton = true,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-close after duration
    if (duration > 0) {
      const closeTimer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Animation duration
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'notification-success';
      case 'error':
        return 'notification-error';
      case 'warning':
        return 'notification-warning';
      default:
        return 'notification-info';
    }
  };

  return (
    <div 
      className={`
        notification 
        ${getTypeClasses()} 
        ${isVisible ? 'visible' : ''} 
        ${isExiting ? 'exiting' : ''}
        notification-${position}
      `}
    >
      <div className="notification-icon">
        {getIcon()}
      </div>
      
      <div className="notification-content">
        {title && (
          <h4 className="notification-title">{title}</h4>
        )}
        <p className="notification-message">{message}</p>
      </div>

      {showCloseButton && (
        <button
          onClick={handleClose}
          className="notification-close"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}

      {duration > 0 && (
        <div 
          className="notification-progress"
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
};

// Notification container component
export const NotificationContainer = ({ notifications, position = 'top-right' }) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'notifications-top-left';
      case 'top-center':
        return 'notifications-top-center';
      case 'top-right':
        return 'notifications-top-right';
      case 'bottom-left':
        return 'notifications-bottom-left';
      case 'bottom-center':
        return 'notifications-bottom-center';
      case 'bottom-right':
        return 'notifications-bottom-right';
      default:
        return 'notifications-top-right';
    }
  };

  return (
    <div className={`notifications-container ${getPositionClasses()}`}>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          {...notification}
          position={position}
        />
      ))}
    </div>
  );
};

// Hook for programmatic notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      timestamp: new Date().toISOString(),
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Convenience methods
  const success = (message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  };

  const error = (message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 0, // Don't auto-close error notifications
      ...options
    });
  };

  const warning = (message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      ...options
    });
  };

  const info = (message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info
  };
};

export default Notification;