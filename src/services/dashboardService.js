// src/services/dashboardService.js
import { apiHelpers, endpoints } from '../config/api';

class DashboardService {
  // Get dashboard statistics
  async getDashboardStats(params = {}) {
    try {
      const response = await apiHelpers.get(endpoints.analytics.dashboard, params, {
        cache: true,
        cacheKey: `dashboard-stats-${JSON.stringify(params)}`,
        cacheTTL: 300000 // 5 minutes
      });
      return response;
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw error;
    }
  }

  // Get recent activity
  async getRecentActivity(limit = 10) {
    try {
      const response = await apiHelpers.get('/activity/recent', { limit }, {
        cache: true,
        cacheKey: `recent-activity-${limit}`,
        cacheTTL: 60000 // 1 minute
      });
      return response;
    } catch (error) {
      console.error('Recent activity error:', error);
      throw error;
    }
  }

  // Get upcoming pujas
  async getUpcomingPujas(params = {}) {
    try {
      const response = await apiHelpers.get(endpoints.puja.history, {
        status: 'approved',
        limit: 5,
        upcoming: true,
        ...params
      });
      return response;
    } catch (error) {
      console.error('Upcoming pujas error:', error);
      throw error;
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(timeframe = 'month') {
    try {
      const response = await apiHelpers.get(endpoints.analytics.performance, {
        timeframe,
        includeComparison: true
      });
      return response;
    } catch (error) {
      console.error('Performance metrics error:', error);
      throw error;
    }
  }

  // Get comprehensive dashboard data
  async getDashboardData(params = {}) {
    try {
      const { month, year } = params;
      
      // Make parallel requests for efficiency
      const [
        statsResult,
        activityResult,
        upcomingResult,
        performanceResult
      ] = await Promise.allSettled([
        this.getDashboardStats({ month, year }),
        this.getRecentActivity(5),
        this.getUpcomingPujas({ month, year, limit: 3 }),
        this.getPerformanceMetrics('month')
      ]);

      // Process results and provide fallbacks
      const stats = statsResult.status === 'fulfilled' && statsResult.value.success
        ? statsResult.value.data
        : this.getDefaultStats();

      const recentActivity = activityResult.status === 'fulfilled' && activityResult.value.success
        ? activityResult.value.data
        : [];

      const upcomingPujas = upcomingResult.status === 'fulfilled' && upcomingResult.value.success
        ? upcomingResult.value.data
        : [];

      const performance = performanceResult.status === 'fulfilled' && performanceResult.value.success
        ? performanceResult.value.data
        : {};

      return {
        success: true,
        data: {
          stats: {
            ...stats,
            ...performance
          },
          recentActivity,
          upcomingPujas,
          quickStats: this.processQuickStats(stats, performance)
        }
      };
    } catch (error) {
      console.error('Dashboard data error:', error);
      return {
        success: false,
        error: error.message,
        data: {
          stats: this.getDefaultStats(),
          recentActivity: [],
          upcomingPujas: [],
          quickStats: {
            thisMonth: { propositions: 0, approved: 0, pending: 0, rejected: 0 },
            topPerformers: []
          }
        }
      };
    }
  }

  // Process quick stats data
  processQuickStats(stats, performance) {
    return {
      thisMonth: {
        propositions: stats.monthlyStats?.total || stats.totalPropositions || 0,
        approved: stats.monthlyStats?.approved || 0,
        pending: stats.monthlyStats?.pending || 0,
        rejected: stats.monthlyStats?.rejected || 0
      },
      topPerformers: stats.topPerformers || performance.topPerformers || []
    };
  }

  // Default stats structure
  getDefaultStats() {
    return {
      totalPropositions: 0,
      averageRating: 0,
      monthlyRevenue: 0,
      successRate: 0,
      propositionsTrend: null,
      ratingTrend: null,
      revenueTrend: null,
      successTrend: null,
      monthlyStats: {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0
      },
      topPerformers: [],
      performanceInsight: null,
      revenueInsight: null,
      contentInsight: null
    };
  }

  // Format dashboard data for display
  formatDashboardData(rawData) {
    return {
      ...rawData,
      stats: {
        ...rawData.stats,
        totalPropositions: Number(rawData.stats.totalPropositions) || 0,
        averageRating: Number(rawData.stats.averageRating) || 0,
        monthlyRevenue: Number(rawData.stats.monthlyRevenue) || 0,
        successRate: Number(rawData.stats.successRate) || 0
      }
    };
  }

  // Validate dashboard response
  validateDashboardData(data) {
    const requiredFields = ['stats', 'recentActivity', 'upcomingPujas'];
    return requiredFields.every(field => data.hasOwnProperty(field));
  }

  // Get insights based on data trends
  generateInsights(stats, previousStats = {}) {
    const insights = {
      performanceInsight: null,
      revenueInsight: null,
      contentInsight: null
    };

    // Generate performance insight
    if (stats.averageRating && previousStats.averageRating) {
      const ratingChange = stats.averageRating - previousStats.averageRating;
      if (ratingChange > 0.1) {
        insights.performanceInsight = `User satisfaction has improved by ${ratingChange.toFixed(1)} points, indicating enhanced proposition quality.`;
      } else if (ratingChange < -0.1) {
        insights.performanceInsight = `User satisfaction has decreased by ${Math.abs(ratingChange).toFixed(1)} points. Consider reviewing recent propositions.`;
      } else {
        insights.performanceInsight = 'User satisfaction remains stable. Continue current quality standards.';
      }
    }

    // Generate revenue insight
    if (stats.monthlyRevenue && previousStats.monthlyRevenue) {
      const revenueChange = ((stats.monthlyRevenue - previousStats.monthlyRevenue) / previousStats.monthlyRevenue) * 100;
      if (revenueChange > 10) {
        insights.revenueInsight = `Revenue has increased by ${revenueChange.toFixed(1)}% this month, driven by successful campaigns.`;
      } else if (revenueChange < -10) {
        insights.revenueInsight = `Revenue has decreased by ${Math.abs(revenueChange).toFixed(1)}% this month. Review campaign effectiveness.`;
      } else {
        insights.revenueInsight = 'Revenue growth is steady. Continue optimizing campaign strategies.';
      }
    }

    // Generate content insight
    if (stats.topPerformers && stats.topPerformers.length > 0) {
      const topCategory = stats.topPerformers[0];
      insights.contentInsight = `${topCategory.category || 'Prosperity'} themed pujas are performing best. Consider developing more content in this area.`;
    }

    return insights;
  }
}

export default new DashboardService();