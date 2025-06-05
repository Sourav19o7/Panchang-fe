import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Star, 
  Users, 
  Plus, 
  FileText, 
  BarChart3, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  Target,
  Activity
} from 'lucide-react';

// Mock navigation function for demo
const useNavigate = () => (path) => console.log('Navigate to:', path);

// Mock auth context
const useAuth = () => ({
  user: {
    fullName: 'Priya Sharma',
    email: 'priya@srimandir.com',
    role: 'editor'
  }
});

// Mock app context
const useApp = () => ({
  setBreadcrumbs: () => {},
  selectedMonth: 11,
  selectedYear: 2024
});

// Mock components
const StatsCard = ({ title, value, icon: Icon, color, trend, trendDirection, subtitle, format = 'number', action }) => {
  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR'
        }).format(val);
      case 'percentage':
        return `${val}%`;
      case 'decimal':
        return Number(val).toFixed(1);
      default:
        return new Intl.NumberFormat('en-IN').format(val);
    }
  };

  return (
    <div 
      className={`stats-card stats-card-${color} ${action ? 'clickable' : ''}`}
      onClick={action}
      style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        border: '1px solid #e5e7eb',
        cursor: action ? 'pointer' : 'default',
        transition: 'all 0.2s',
        position: 'relative'
      }}
    >
      <div className="stats-card-content">
        <div className="stats-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div className="stats-icon" style={{ 
            padding: '0.75rem',
            borderRadius: '8px',
            backgroundColor: color === 'primary' ? '#dbeafe' : 
                            color === 'success' ? '#dcfce7' :
                            color === 'warning' ? '#fef3c7' : '#dbeafe',
            color: color === 'primary' ? '#3b82f6' : 
                   color === 'success' ? '#059669' :
                   color === 'warning' ? '#d97706' : '#3b82f6'
          }}>
            {Icon && <Icon size={24} />}
          </div>
          {trend && (
            <div className={`stats-trend trend-${trendDirection}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.875rem',
              color: trendDirection === 'up' ? '#059669' : '#dc2626'
            }}>
              <TrendingUp size={16} />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className="stats-body">
          <h3 className="stats-title" style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{title}</h3>
          <div className="stats-value" style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
            {formatValue(value)}
          </div>
          {subtitle && (
            <p className="stats-subtitle" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const RecentActivity = ({ activities, limit = 5 }) => {
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'proposition_created': return FileText;
      case 'feedback_received': return MessageSquare;
      case 'export_completed': return Download;
      case 'analysis_generated': return BarChart3;
      default: return FileText;
    }
  };

  return (
    <div className="recent-activity">
      <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activities.slice(0, limit).map((activity) => {
          const ActivityIcon = getActivityIcon(activity.type);
          
          return (
            <div key={activity.id} className="activity-item" style={{
              display: 'flex',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
              border: '1px solid #f3f4f6'
            }}>
              <div className="activity-icon" style={{
                padding: '0.5rem',
                borderRadius: '6px',
                backgroundColor: '#3b82f6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ActivityIcon size={16} />
              </div>
              
              <div className="activity-content" style={{ flex: '1' }}>
                <h4 className="activity-title" style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {activity.title}
                </h4>
                <p className="activity-description" style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  {activity.description}
                </p>
                <div className="activity-meta" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af' }}>
                  <span>by {activity.user}</span>
                  <span>{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Loading = ({ message }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      border: '3px solid #e5e7eb',
      borderTop: '3px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <p>{message}</p>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setBreadcrumbs, selectedMonth, selectedYear } = useApp();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/' }
    ]);
    loadDashboardData();
  }, [setBreadcrumbs]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setDashboardData({
          stats: {
            totalPropositions: 156,
            averageRating: 4.3,
            monthlyRevenue: 850000,
            successRate: 92.5
          },
          recentActivity: [
            {
              id: 1,
              type: 'proposition_created',
              title: 'New Diwali Lakshmi Puja Created',
              description: 'AI-generated proposition for financial prosperity during Diwali',
              user: 'Priya Sharma',
              timestamp: new Date(Date.now() - 30 * 60 * 1000),
              status: 'completed'
            },
            {
              id: 2,
              type: 'feedback_received',
              title: 'Feedback Received for Ganesh Chaturthi',
              description: 'Performance data and user feedback collected',
              user: 'Rajesh Kumar',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              status: 'completed'
            },
            {
              id: 3,
              type: 'export_completed',
              title: 'Monthly Report Exported',
              description: 'October propositions exported to Google Sheets',
              user: 'Anita Desai',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
              status: 'completed'
            },
            {
              id: 4,
              type: 'analysis_generated',
              title: 'Performance Analysis Complete',
              description: 'AI analysis of September campaign performance',
              user: 'System',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
              status: 'completed'
            }
          ],
          upcomingPujas: [
            {
              id: 1,
              name: 'Karva Chauth Special Puja',
              date: '2024-11-01',
              deity: 'Parvati',
              status: 'approved'
            },
            {
              id: 2,
              name: 'Diwali Lakshmi Puja',
              date: '2024-11-01',
              deity: 'Lakshmi',
              status: 'pending_review'
            },
            {
              id: 3,
              name: 'Bhai Dooj Celebration',
              date: '2024-11-03',
              deity: 'Krishna',
              status: 'approved'
            }
          ],
          quickStats: {
            thisMonth: {
              propositions: 23,
              approved: 18,
              pending: 3,
              rejected: 2
            },
            topPerformers: [
              { name: 'Diwali Lakshmi Puja', rating: 4.8, revenue: 125000 },
              { name: 'Ganesh Chaturthi Special', rating: 4.7, revenue: 98000 },
              { name: 'Navratri Durga Puja', rating: 4.6, revenue: 87000 }
            ]
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#059669';
      case 'rejected': return '#dc2626';
      case 'pending_review': return '#d97706';
      default: return '#3b82f6';
    }
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  const containerStyle = {
    padding: '2rem',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    fontFamily: 'Inter, sans-serif'
  };

  const welcomeSectionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    border: '1px solid #e5e7eb'
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '1.5rem'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  };

  const dashboardGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem'
  };

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  };

  const cardTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#111827'
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const outlineButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '1px solid #3b82f6'
  };

  const linkButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.875rem',
    color: '#3b82f6',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Welcome Section */}
      <div style={welcomeSectionStyle}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
            {getGreeting()}, {user?.fullName?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Ready to create some amazing puja propositions? Let's make today spiritually productive.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/puja/generate')}
            style={buttonStyle}
          >
            <Plus size={16} />
            Generate New Puja
          </button>
          <button
            onClick={() => navigate('/puja/calendar')}
            style={outlineButtonStyle}
          >
            <Calendar size={16} />
            View Calendar
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 style={sectionTitleStyle}>Overview</h2>
        <div style={statsGridStyle}>
          <StatsCard
            title="Total Propositions"
            value={dashboardData.stats.totalPropositions}
            icon={FileText}
            color="primary"
            trend="+12"
            trendDirection="up"
            subtitle="This month"
            action={() => navigate('/puja/calendar')}
          />
          <StatsCard
            title="Average Rating"
            value={dashboardData.stats.averageRating}
            icon={Star}
            color="success"
            format="decimal"
            trend="+0.3"
            trendDirection="up"
            subtitle="User satisfaction"
            action={() => navigate('/feedback/analysis')}
          />
          <StatsCard
            title="Monthly Revenue"
            value={dashboardData.stats.monthlyRevenue}
            icon={TrendingUp}
            color="warning"
            format="currency"
            trend="+18%"
            trendDirection="up"
            subtitle="Current month"
            action={() => navigate('/analytics/performance')}
          />
          <StatsCard
            title="Success Rate"
            value={dashboardData.stats.successRate}
            icon={Target}
            color="info"
            format="percentage"
            trend="+5%"
            trendDirection="up"
            subtitle="Approval rate"
            action={() => navigate('/analytics/metrics')}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={dashboardGridStyle}>
        {/* Recent Activity */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>
              <Activity size={20} />
              Recent Activity
            </h3>
            <button 
              onClick={() => navigate('/activity')}
              style={linkButtonStyle}
            >
              View All
              <ChevronRight size={14} />
            </button>
          </div>
          <RecentActivity activities={dashboardData.recentActivity} limit={4} />
        </div>

        {/* Upcoming Pujas */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>
              <Calendar size={20} />
              Upcoming Pujas
            </h3>
            <button 
              onClick={() => navigate('/puja/calendar')}
              style={linkButtonStyle}
            >
              View Calendar
              <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dashboardData.upcomingPujas.map((puja) => (
              <div key={puja.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #f3f4f6'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {puja.name}
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                    <span>
                      {new Date(puja.date).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span>• {puja.deity}</span>
                  </div>
                </div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: puja.status === 'approved' ? '#dcfce7' : '#fef3c7',
                  color: getStatusColor(puja.status)
                }}>
                  {puja.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* This Month's Performance */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>
              <BarChart3 size={20} />
              This Month's Performance
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>
                {dashboardData.quickStats.thisMonth.propositions}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Propositions</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669' }}>
                {dashboardData.quickStats.thisMonth.approved}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Approved</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#d97706' }}>
                {dashboardData.quickStats.thisMonth.pending}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pending</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626' }}>
                {dashboardData.quickStats.thisMonth.rejected}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Rejected</div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>
              <Star size={20} />
              Top Performers
            </h3>
            <button 
              onClick={() => navigate('/feedback/analysis')}
              style={linkButtonStyle}
            >
              View Details
              <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dashboardData.quickStats.topPerformers.map((performer, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #f3f4f6'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  #{index + 1}
                </div>
                <div style={{ flex: '1' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {performer.name}
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                    <span>⭐ {performer.rating}</span>
                    <span>₹{performer.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={sectionTitleStyle}>Quick Actions</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {[
            {
              icon: Sparkles,
              title: 'Generate Propositions',
              description: 'Create AI-powered puja propositions for this month',
              color: '#3b82f6',
              path: '/puja/generate'
            },
            {
              icon: MessageSquare,
              title: 'Submit Feedback',
              description: 'Provide feedback on completed puja campaigns',
              color: '#059669',
              path: '/feedback/submit'
            },
            {
              icon: Target,
              title: 'Experimental Pujas',
              description: 'Explore innovative puja concepts and experiments',
              color: '#d97706',
              path: '/puja/experimental'
            },
            {
              icon: BarChart3,
              title: 'View Analytics',
              description: 'Analyze performance trends and insights',
              color: '#3b82f6',
              path: '/analytics'
            }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <div style={{
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: `${action.color}20`,
                color: action.color
              }}>
                <action.icon size={24} />
              </div>
              <div style={{ flex: '1' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {action.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {action.description}
                </p>
              </div>
              <ChevronRight size={16} color="#9ca3af" />
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Insights */}
      <div>
        <h2 style={sectionTitleStyle}>Monthly Insights</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            {
              emoji: '🎯',
              title: 'Performance Trend',
              text: "This month's propositions are showing a 15% improvement in user engagement compared to last month, with Lakshmi and Ganesha pujas leading the way."
            },
            {
              emoji: '📈',
              title: 'Revenue Growth',
              text: 'Festival season campaigns are driving strong revenue growth, with Diwali preparations showing 25% higher conversion rates than projected.'
            },
            {
              emoji: '🎨',
              title: 'Content Strategy',
              text: 'Prosperity and health-focused pujas continue to resonate most with users, suggesting opportunities for targeted campaign development.'
            }
          ].map((insight, index) => (
            <div key={index} style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{insight.emoji}</span>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{insight.title}</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;