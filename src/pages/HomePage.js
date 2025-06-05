import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Plus,
  Star,
  Target,
  Download,
  Activity,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import Loading from '../components/common/Loading';
import { apiHelpers, endpoints } from '../config/api';
import dashboardService from '../services/dashboardService';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setBreadcrumbs, selectedMonth, selectedYear } = useApp();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize the loadDashboardData function to prevent unnecessary re-renders
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the dashboard service for comprehensive data loading
      const result = await dashboardService.getDashboardData({
        month: selectedMonth,
        year: selectedYear
      });

      if (result.success) {
        setDashboardData(dashboardService.formatDashboardData(result.data));
      } else {
        throw new Error(result.error || 'Failed to load dashboard data');
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
      
      // Set fallback data
      setDashboardData({
        stats: dashboardService.getDefaultStats(),
        recentActivity: [],
        upcomingPujas: [],
        quickStats: {
          thisMonth: { propositions: 0, approved: 0, pending: 0, rejected: 0 },
          topPerformers: []
        }
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]); // Only depend on month/year

  // Set breadcrumbs only once
  useEffect(() => {
    setBreadcrumbs([{ label: 'Dashboard', path: '/' }]);
  }, [setBreadcrumbs]);

  // Load dashboard data only when month/year changes
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const getDefaultStats = () => dashboardService.getDefaultStats();

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

  const handleQuickAction = (path) => {
    navigate(path);
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="error-state">
        <h2>Failed to load dashboard</h2>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Welcome Section */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="welcome-section">
            <div className="welcome-content">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {getGreeting()}, {user?.fullName?.split(' ')[0] || 'User'}! 👋
              </h1>
              <p className="text-lg text-gray-600">
                Ready to create some amazing puja propositions? Let's make today spiritually productive.
              </p>
            </div>
            <div className="welcome-actions">
              <button
                onClick={() => handleQuickAction('/puja/generate')}
                className="btn btn-primary"
              >
                <Plus size={16} />
                Generate New Puja
              </button>
              <button
                onClick={() => handleQuickAction('/puja/calendar')}
                className="btn btn-outline"
              >
                <Calendar size={16} />
                View Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid mb-8">
        <StatsCard
          title="Total Propositions"
          value={dashboardData.stats.totalPropositions}
          icon={FileText}
          color="primary"
          trend={dashboardData.stats.propositionsTrend}
          trendDirection="up"
          subtitle="This month"
          action={() => handleQuickAction('/puja/calendar')}
        />
        <StatsCard
          title="Average Rating"
          value={dashboardData.stats.averageRating}
          icon={Star}
          color="success"
          format="decimal"
          trend={dashboardData.stats.ratingTrend}
          trendDirection="up"
          subtitle="User satisfaction"
          action={() => handleQuickAction('/feedback/analysis')}
        />
        <StatsCard
          title="Monthly Revenue"
          value={dashboardData.stats.monthlyRevenue}
          icon={TrendingUp}
          color="warning"
          format="currency"
          trend={dashboardData.stats.revenueTrend}
          trendDirection="up"
          subtitle="Current month"
          action={() => handleQuickAction('/analytics/performance')}
        />
        <StatsCard
          title="Success Rate"
          value={dashboardData.stats.successRate}
          icon={Target}
          color="info"
          format="percentage"
          trend={dashboardData.stats.successTrend}
          trendDirection="up"
          subtitle="Approval rate"
          action={() => handleQuickAction('/analytics/metrics')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="content-grid mb-8">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Activity size={20} />
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
            <button 
              onClick={() => handleQuickAction('/activity')}
              className="btn btn-link"
            >
              View All
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="card-body">
            {dashboardData.recentActivity.length === 0 ? (
              <div className="empty-state">
                <Clock size={32} className="text-gray-400 mb-2" />
                <p className="text-gray-600">No recent activity</p>
                <p className="text-sm text-gray-500">Activity will appear here as you work with propositions</p>
              </div>
            ) : (
              <RecentActivity activities={dashboardData.recentActivity} limit={4} />
            )}
          </div>
        </div>

        {/* Upcoming Pujas */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <h3 className="text-lg font-semibold">Upcoming Pujas</h3>
            </div>
            <button 
              onClick={() => handleQuickAction('/puja/calendar')}
              className="btn btn-link"
            >
              View Calendar
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="card-body">
            {dashboardData.upcomingPujas.length === 0 ? (
              <div className="empty-state">
                <Calendar size={32} className="text-gray-400 mb-2" />
                <p className="text-gray-600">No upcoming pujas scheduled</p>
                <button 
                  onClick={() => handleQuickAction('/puja/generate')}
                  className="btn btn-sm btn-primary mt-2"
                >
                  Generate New
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.upcomingPujas.map((puja) => (
                  <div key={puja.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm">
                        {puja.proposition_data?.pujaName || puja.name}
                      </h4>
                      <div className="flex gap-2 text-xs text-gray-600">
                        <span>
                          {new Date(puja.date).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span>• {puja.proposition_data?.deity || puja.deity}</span>
                      </div>
                    </div>
                    <span 
                      className="status-badge"
                      style={{
                        backgroundColor: puja.status === 'approved' ? '#dcfce7' : '#fef3c7',
                        color: getStatusColor(puja.status)
                      }}
                    >
                      {puja.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* This Month's Performance */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} />
              <h3 className="text-lg font-semibold">This Month's Performance</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData.quickStats.thisMonth.propositions}
                </div>
                <div className="text-sm text-gray-600">Total Propositions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dashboardData.quickStats.thisMonth.approved}
                </div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {dashboardData.quickStats.thisMonth.pending}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {dashboardData.quickStats.thisMonth.rejected}
                </div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Star size={20} />
              <h3 className="text-lg font-semibold">Top Performers</h3>
            </div>
            <button 
              onClick={() => handleQuickAction('/feedback/analysis')}
              className="btn btn-link"
            >
              View Details
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="card-body">
            {dashboardData.quickStats.topPerformers.length === 0 ? (
              <div className="empty-state">
                <Star size={32} className="text-gray-400 mb-2" />
                <p className="text-gray-600">No performance data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.quickStats.topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {performer.name}
                      </h4>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>⭐ {performer.rating}</span>
                        <span>₹{performer.revenue?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              onClick={() => handleQuickAction(action.path)}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all text-left"
            >
              <div 
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: `${action.color}20`,
                  color: action.color
                }}
              >
                <action.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {action.description}
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Insights */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              emoji: '🎯',
              title: 'Performance Trend',
              text: dashboardData.stats.performanceInsight || "Monitor your puja proposition performance and user engagement trends."
            },
            {
              emoji: '📈',
              title: 'Revenue Growth',
              text: dashboardData.stats.revenueInsight || "Track revenue growth from successful puja campaigns and seasonal performance."
            },
            {
              emoji: '🎨',
              title: 'Content Strategy',
              text: dashboardData.stats.contentInsight || "Optimize your content strategy based on user preferences and engagement data."
            }
          ].map((insight, index) => (
            <div key={index} className="card">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{insight.emoji}</span>
                  <h4 className="font-semibold">{insight.title}</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {insight.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;