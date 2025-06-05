
// ==================================================
// 5. src/pages/SettingsPage.js
// ==================================================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { User, Settings, Lock } from 'lucide-react';

const ProfileSettings = () => {
  const { user } = useAuth();

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2>Profile Information</h2>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            className="form-input" 
            defaultValue={user?.fullName} 
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            className="form-input" 
            defaultValue={user?.email} 
            disabled 
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <input 
            type="text" 
            className="form-input" 
            defaultValue={user?.role} 
            disabled 
          />
        </div>
        <button className="btn btn-primary">Update Profile</button>
      </div>
    </div>
  );
};

const GeneralSettings = () => {
  const { theme, setTheme } = useApp();

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2>General Settings</h2>
        <div className="form-group">
          <label>Theme</label>
          <select 
            className="form-select" 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" className="checkbox-input" />
            <span className="checkbox-custom"></span>
            Enable notifications
          </label>
        </div>
        <button className="btn btn-primary">Save Settings</button>
      </div>
    </div>
  );
};

const SecuritySettings = () => (
  <div className="settings-content">
    <div className="settings-section">
      <h2>Security Settings</h2>
      <div className="form-group">
        <label>Current Password</label>
        <input type="password" className="form-input" />
      </div>
      <div className="form-group">
        <label>New Password</label>
        <input type="password" className="form-input" />
      </div>
      <div className="form-group">
        <label>Confirm Password</label>
        <input type="password" className="form-input" />
      </div>
      <button className="btn btn-primary">Change Password</button>
    </div>
  </div>
);

const SettingsPage = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/' },
      { label: 'Settings', path: '/settings' }
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="page">
      <div className="settings-layout">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            <a href="/settings/profile" className="settings-nav-item">
              <User size={16} />
              Profile
            </a>
            <a href="/settings" className="settings-nav-item">
              <Settings size={16} />
              General
            </a>
            <a href="/settings/security" className="settings-nav-item">
              <Lock size={16} />
              Security
            </a>
          </nav>
        </div>
        
        <div className="settings-main">
          <Routes>
            <Route index element={<GeneralSettings />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="security" element={<SecuritySettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;