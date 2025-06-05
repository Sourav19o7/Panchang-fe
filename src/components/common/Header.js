import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toggleSidebar, theme, setTheme, notifications, clearNotifications } = useApp();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="header">
      <div className="header-content">
        {/* Left side */}
        <div className="header-left">
          <button 
            onClick={toggleSidebar}
            className="sidebar-toggle"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          
          <div className="header-title">
            <h1>Puja Proposition Agent</h1>
          </div>
        </div>

        {/* Right side */}
        <div className="header-right">
          {/* Theme toggle */}
          <button 
            onClick={toggleTheme}
            className="header-btn theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Notifications */}
          <div className="notifications-dropdown" ref={notificationsRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="header-btn notifications-btn"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </button>

            {showNotifications && (
              <div className="dropdown-menu notifications-menu">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearNotifications}
                      className="clear-notifications"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="empty-notifications">
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <div className="notification-content">
                          <p className="notification-title">{notification.title}</p>
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 5 && (
                  <div className="dropdown-footer">
                    <button 
                      onClick={() => navigate('/notifications')}
                      className="view-all-btn"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="user-dropdown" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="user-menu-btn"
              aria-label="User menu"
            >
              <div className="user-avatar">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} />
                ) : (
                  <User size={18} />
                )}
              </div>
              <span className="user-name">{user?.fullName}</span>
              <ChevronDown size={16} className="chevron" />
            </button>

            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <div className="dropdown-header">
                  <div className="user-info">
                    <div className="user-avatar large">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.fullName} />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="user-details">
                      <p className="user-name">{user?.fullName}</p>
                      <p className="user-email">{user?.email}</p>
                      <span className="user-role">{user?.role}</span>
                    </div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-items">
                  <button 
                    onClick={() => {
                      navigate('/settings/profile');
                      setShowUserMenu(false);
                    }}
                    className="dropdown-item"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  
                  <button 
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="dropdown-item"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                </div>

                <div className="dropdown-divider"></div>

                <button 
                  onClick={handleLogout}
                  className="dropdown-item logout"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;