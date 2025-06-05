import React from 'react';
import { 
  FileText, 
  MessageSquare, 
  Download, 
  BarChart3, 
  User,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const RecentActivity = ({ activities = [], limit = 5 }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'proposition_created':
        return FileText;
      case 'feedback_received':
        return MessageSquare;
      case 'export_completed':
        return Download;
      case 'analysis_generated':
        return BarChart3;
      default:
        return FileText;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'failed':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time.toLocaleDateString();
  };

  const displayedActivities = activities.slice(0, limit);

  if (activities.length === 0) {
    return (
      <div className="recent-activity-empty">
        <div className="empty-state">
          <Clock size={48} className="empty-icon" />
          <h3>No recent activity</h3>
          <p>When you start working with propositions, your activity will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <div className="activity-list">
        {displayedActivities.map((activity) => {
          const ActivityIcon = getActivityIcon(activity.type);
          const StatusIcon = getStatusIcon(activity.status);
          
          return (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                <ActivityIcon size={20} />
              </div>
              
              <div className="activity-content">
                <div className="activity-header">
                  <h4 className="activity-title">{activity.title}</h4>
                  <div className={`activity-status status-${getStatusColor(activity.status)}`}>
                    <StatusIcon size={14} />
                    <span className="status-text">{activity.status}</span>
                  </div>
                </div>
                
                <p className="activity-description">{activity.description}</p>
                
                <div className="activity-meta">
                  <div className="activity-user">
                    <User size={12} />
                    <span>{activity.user}</span>
                  </div>
                  <span className="activity-time">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activities.length > limit && (
        <div className="activity-footer">
          <button className="btn btn-link">
            View all {activities.length} activities
          </button>
        </div>
      )}
    </div>
  );
};

// Activity timeline component for detailed view
export const ActivityTimeline = ({ activities = [], groupByDate = false }) => {
  const groupActivitiesByDate = (activities) => {
    if (!groupByDate) return { 'All': activities };
    
    return activities.reduce((groups, activity) => {
      const date = new Date(activity.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    }, {});
  };

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <div className="activity-timeline">
      {Object.entries(groupedActivities).map(([date, dateActivities]) => (
        <div key={date} className="timeline-group">
          {groupByDate && (
            <div className="timeline-date">
              <h3>{date === new Date().toDateString() ? 'Today' : date}</h3>
            </div>
          )}
          
          <div className="timeline-items">
            {dateActivities.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity.type);
              
              return (
                <div key={activity.id} className="timeline-item">
                  <div className="timeline-connector">
                    <div className="timeline-dot">
                      <ActivityIcon size={16} />
                    </div>
                    {index < dateActivities.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>
                  
                  <div className="timeline-content">
                    <div className="timeline-card">
                      <div className="card-header">
                        <h4>{activity.title}</h4>
                        <span className="timeline-time">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <p className="card-description">{activity.description}</p>
                      
                      <div className="card-footer">
                        <span className="activity-user">by {activity.user}</span>
                        <div className={`activity-status status-${getStatusColor(activity.status)}`}>
                          <span>{activity.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Activity filters component
export const ActivityFilters = ({ 
  filters, 
  onFilterChange, 
  types = [], 
  statuses = [], 
  users = [] 
}) => {
  return (
    <div className="activity-filters">
      <div className="filter-group">
        <label htmlFor="type-filter">Type</label>
        <select
          id="type-filter"
          value={filters.type || ''}
          onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
          className="form-select"
        >
          <option value="">All Types</option>
          {types.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="form-select"
        >
          <option value="">All Statuses</option>
          {statuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="user-filter">User</label>
        <select
          id="user-filter"
          value={filters.user || ''}
          onChange={(e) => onFilterChange({ ...filters, user: e.target.value })}
          className="form-select"
        >
          <option value="">All Users</option>
          {users.map(user => (
            <option key={user.value} value={user.value}>
              {user.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="date-filter">Date Range</label>
        <select
          id="date-filter"
          value={filters.dateRange || ''}
          onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
          className="form-select"
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      <button
        onClick={() => onFilterChange({})}
        className="btn btn-outline"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default RecentActivity;