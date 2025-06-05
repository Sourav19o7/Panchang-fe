import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend = null,
  trendDirection = null,
  subtitle = null,
  format = 'number',
  action = null,
  loading = false
}) => {
  const formatValue = (val) => {
    if (loading) return '...';
    
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

  const getTrendIcon = () => {
    if (!trend || !trendDirection) return null;
    
    return trendDirection === 'up' ? (
      <TrendingUp size={16} className="trend-icon trend-up" />
    ) : (
      <TrendingDown size={16} className="trend-icon trend-down" />
    );
  };

  const cardClasses = [
    'stats-card',
    `stats-card-${color}`,
    action ? 'clickable' : '',
    loading ? 'loading' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={action}
      role={action ? 'button' : undefined}
      tabIndex={action ? 0 : undefined}
      onKeyDown={action ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          action();
        }
      } : undefined}
    >
      <div className="stats-card-content">
        <div className="stats-header">
          <div className="stats-icon">
            {Icon && <Icon size={24} />}
          </div>
          {trend && (
            <div className={`stats-trend trend-${trendDirection}`}>
              {getTrendIcon()}
              <span className="trend-value">{trend}</span>
            </div>
          )}
        </div>

        <div className="stats-body">
          <h3 className="stats-title">{title}</h3>
          <div className="stats-value">
            {loading ? (
              <div className="stats-skeleton"></div>
            ) : (
              formatValue(value)
            )}
          </div>
          {subtitle && (
            <p className="stats-subtitle">{subtitle}</p>
          )}
        </div>
      </div>

      {loading && (
        <div className="stats-loading-overlay">
          <div className="loading-spinner small"></div>
        </div>
      )}
    </div>
  );
};

// Specialized stats cards
export const MetricCard = ({ title, current, previous, format = 'number' }) => {
  const calculateTrend = () => {
    if (!previous || previous === 0) return null;
    
    const change = ((current - previous) / previous) * 100;
    return {
      value: `${Math.abs(change).toFixed(1)}%`,
      direction: change >= 0 ? 'up' : 'down'
    };
  };

  const trend = calculateTrend();

  return (
    <StatsCard
      title={title}
      value={current}
      format={format}
      trend={trend?.value}
      trendDirection={trend?.direction}
      color={trend?.direction === 'up' ? 'success' : 'warning'}
    />
  );
};

export const PerformanceCard = ({ title, value, target, format = 'percentage' }) => {
  const percentage = target ? (value / target) * 100 : 0;
  const isOnTrack = percentage >= 80;

  return (
    <div className={`performance-card ${isOnTrack ? 'on-track' : 'behind'}`}>
      <div className="performance-header">
        <h3>{title}</h3>
        <span className={`performance-status ${isOnTrack ? 'success' : 'warning'}`}>
          {isOnTrack ? 'On Track' : 'Behind Target'}
        </span>
      </div>
      
      <div className="performance-metrics">
        <div className="metric">
          <span className="metric-label">Current</span>
          <span className="metric-value">
            {format === 'percentage' ? `${value}%` : value}
          </span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Target</span>
          <span className="metric-value">
            {format === 'percentage' ? `${target}%` : target}
          </span>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export const ComparisonCard = ({ title, data, format = 'number' }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="comparison-card">
      <h3 className="comparison-title">{title}</h3>
      <div className="comparison-items">
        {data.map((item, index) => (
          <div key={index} className="comparison-item">
            <div className="item-header">
              <span className="item-label">{item.label}</span>
              <span className="item-value">
                {format === 'percentage' ? `${item.value}%` : item.value}
              </span>
            </div>
            <div className="item-bar">
              <div 
                className="item-fill"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;