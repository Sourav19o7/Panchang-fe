import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  FileText,
  Sparkles,
  TrendingUp,
  Users,
  Upload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { sidebarOpen } = useApp();
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/',
      roles: ['admin', 'editor', 'user']
    },
    {
      id: 'puja',
      label: 'Puja Management',
      icon: Calendar,
      path: '/puja',
      roles: ['admin', 'editor', 'user'],
      subItems: [
        { label: 'Generate Propositions', path: '/puja/generate' },
        { label: 'View Calendar', path: '/puja/calendar' },
        { label: 'Panchang Data', path: '/puja/panchang' },
        { label: 'Experimental Pujas', path: '/puja/experimental' }
      ]
    },
    {
      id: 'feedback',
      label: 'Feedback & Analysis',
      icon: MessageSquare,
      path: '/feedback',
      roles: ['admin', 'editor', 'user'],
      subItems: [
        { label: 'Submit Feedback', path: '/feedback/submit' },
        { label: 'View History', path: '/feedback/history' },
        { label: 'Performance Analysis', path: '/feedback/analysis' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      roles: ['admin', 'editor'],
      subItems: [
        { label: 'Performance Dashboard', path: '/analytics/performance' },
        { label: 'Trend Analysis', path: '/analytics/trends' },
        { label: 'Success Metrics', path: '/analytics/metrics' }
      ]
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      path: '/documents',
      roles: ['admin', 'editor', 'user'],
      subItems: [
        { label: 'Upload PDFs', path: '/documents/upload' },
        { label: 'Manage Files', path: '/documents/manage' },
        { label: 'Reference Library', path: '/documents/library' }
      ]
    }
  ];

  const adminItems = [
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      path: '/admin/users',
      roles: ['admin']
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      roles: ['admin', 'editor']
    }
  ];

  const hasPermission = (roles) => {
    return roles.includes(user?.role);
  };

  const isActiveParent = (item) => {
    if (item.path === '/' && location.pathname === '/') return true;
    if (item.path !== '/' && location.pathname.startsWith(item.path)) return true;
    return false;
  };

  const SidebarItem = ({ item, isSubItem = false }) => {
    const Icon = item.icon;
    const isActive = isSubItem 
      ? location.pathname === item.path 
      : isActiveParent(item);

    return (
      <li className={`sidebar-item ${isSubItem ? 'sub-item' : ''}`}>
        <NavLink
          to={item.path}
          className={({ isActive: navIsActive }) => 
            `sidebar-link ${(isActive || navIsActive) ? 'active' : ''}`
          }
        >
          {Icon && <Icon size={18} className="sidebar-icon" />}
          <span className={`sidebar-text ${!sidebarOpen ? 'hidden' : ''}`}>
            {item.label}
          </span>
        </NavLink>

        {/* Sub-items */}
        {item.subItems && sidebarOpen && isActive && (
          <ul className="sidebar-subitems">
            {item.subItems.map((subItem, index) => (
              <SidebarItem 
                key={index} 
                item={subItem} 
                isSubItem={true} 
              />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        {/* Logo/Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Sparkles size={24} />
          </div>
          {sidebarOpen && (
            <div className="brand-text">
              <h2>Puja Agent</h2>
              <span>v1.0.0</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Main Navigation */}
          <div className="nav-section">
            {sidebarOpen && (
              <h3 className="nav-section-title">Main</h3>
            )}
            <ul className="nav-list">
              {navigationItems
                .filter(item => hasPermission(item.roles))
                .map(item => (
                  <SidebarItem key={item.id} item={item} />
                ))
              }
            </ul>
          </div>

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <div className="nav-section">
              {sidebarOpen && (
                <h3 className="nav-section-title">Administration</h3>
              )}
              <ul className="nav-list">
                {adminItems
                  .filter(item => hasPermission(item.roles))
                  .map(item => (
                    <SidebarItem key={item.id} item={item} />
                  ))
                }
              </ul>
            </div>
          )}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="user-summary">
              <div className="user-avatar small">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <p className="user-name">{user?.fullName}</p>
                <p className="user-role">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;