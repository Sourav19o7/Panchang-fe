import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  FileText, 
  BarChart3, 
  Upload,
  Download,
  Brain,
  Users,
  Rocket,
  Search,
  Settings
} from 'lucide-react';
import FocusSuggestion from './FocusSuggestion';
import PanchangGenerator from './PanchangGenerator';
import PropositionGenerator from './PropositionGenerator';
import AdvancedPropositionManager from './AdvancedPropositionManager';
import FeedbackAnalysis from './FeedbackAnalysis';
import AdvancedAnalytics from './AdvancedAnalytics';
import TeamReview from './TeamReview';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('focus');

  const tabs = [
    { id: 'focus', name: 'Focus Suggestion', icon: Brain, component: FocusSuggestion },
    { id: 'panchang', name: 'Panchang Data', icon: Calendar, component: PanchangGenerator },
    { id: 'propositions', name: 'Generate Pujas', icon: Sparkles, component: PropositionGenerator },
    { id: 'advanced-manager', name: 'Advanced Manager', icon: Search, component: AdvancedPropositionManager },
    { id: 'feedback', name: 'Feedback & Analysis', icon: BarChart3, component: FeedbackAnalysis },
    { id: 'advanced', name: 'Advanced Analytics', icon: Rocket, component: AdvancedAnalytics },
    { id: 'team-review', name: 'Team Review', icon: Users, component: TeamReview },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Puja Proposition Agent</h1>
        <p className="dashboard-subtitle">
          Professional AI-powered spiritual content creation with advanced analytics and innovation tools
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '1rem',
        marginBottom: '2rem',
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #ff6b35, #ff8e3c)' 
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                border: activeTab === tab.id ? 'none' : '2px solid #e2e8f0',
                padding: '12px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                flex: '1',
                minWidth: '140px',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Professional AI Indicators */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '15px',
        padding: '1rem',
        marginBottom: '2rem',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
          <Brain size={20} />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Professional AI System Active</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
          <div>🎯 <strong>12+ AI Prompts</strong> - Professional grade</div>
          <div>🧠 <strong>Smart Fallbacks</strong> - Always operational</div>
          <div>📊 <strong>Advanced Analytics</strong> - Strategic insights</div>
          <div>🚀 <strong>Innovation Tools</strong> - Breakthrough ideas</div>
        </div>
      </div>

      {/* Feature Highlights based on active tab */}
      {activeTab === 'advanced-manager' && (
        <div style={{ 
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <Search size={20} style={{ color: '#667eea' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#667eea' }}>Advanced Proposition Management</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>🔍 <strong>Smart Search & Filters</strong> - Advanced proposition discovery</div>
            <div>⚡ <strong>Bulk Operations</strong> - Efficient workflow management</div>
            <div>🧪 <strong>A/B Testing</strong> - Scientific optimization</div>
            <div>💡 <strong>Innovation Lab</strong> - Breakthrough ideation</div>
            <div>📈 <strong>Why-Why Analysis</strong> - Deep strategic insights</div>
            <div>🎨 <strong>Variations Generator</strong> - Creative alternatives</div>
          </div>
        </div>
      )}

      {activeTab === 'propositions' && (
        <div style={{ 
          background: 'rgba(255, 193, 7, 0.1)',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 193, 7, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <Sparkles size={20} style={{ color: '#ffc107' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffc107' }}>Proposition Generation</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>🎯 <strong>AI-Powered Creation</strong> - Intelligent content generation</div>
            <div>📅 <strong>Panchang Integration</strong> - Astrologically aligned timing</div>
            <div>🧪 <strong>Experimental Concepts</strong> - Bold innovation</div>
            <div>📊 <strong>Performance Context</strong> - Data-driven insights</div>
          </div>
        </div>
      )}

      {activeTab === 'advanced' && (
        <div style={{ 
          background: 'rgba(220, 53, 69, 0.1)',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(220, 53, 69, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <Rocket size={20} style={{ color: '#dc3545' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#dc3545' }}>Advanced Analytics & Innovation</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>📊 <strong>Competitive Analysis</strong> - Market positioning insights</div>
            <div>🌟 <strong>Seasonal Optimization</strong> - Time-based strategies</div>
            <div>💡 <strong>Innovation Workshop</strong> - Breakthrough ideation</div>
            <div>🔬 <strong>Rapid Prototyping</strong> - Quick concept validation</div>
          </div>
        </div>
      )}

      {/* Quick Navigation Helper */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        <Settings size={16} />
        <span><strong>Quick Tip:</strong> </span>
        {activeTab === 'focus' && 'Start here to get AI-powered monthly focus recommendations based on historical data and seasonal events.'}
        {activeTab === 'panchang' && 'Generate comprehensive Panchang data for accurate astrological timing in your propositions.'}
        {activeTab === 'propositions' && 'Create new puja propositions with AI assistance, PDF references, and experimental concepts.'}
        {activeTab === 'advanced-manager' && 'Search, analyze, and manage existing propositions with advanced AI-powered tools and bulk operations.'}
        {activeTab === 'feedback' && 'Analyze performance data and synthesize feedback to improve future propositions.'}
        {activeTab === 'advanced' && 'Access professional-grade analytics for competitive analysis, seasonal optimization, and breakthrough innovation.'}
        {activeTab === 'team-review' && 'Collaborate with your team to review, approve, and sync feedback from Google Sheets.'}
      </div>

      {/* Active Component */}
      <div style={{ minHeight: '500px' }}>
        {ActiveComponent && <ActiveComponent />}
      </div>

      {/* Workflow Guide */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        marginTop: '3rem',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#333', marginBottom: '1.5rem' }}>Recommended Workflow</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>1️⃣</div>
            <div style={{ fontWeight: '600', color: '#667eea' }}>Focus Strategy</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Generate monthly themes</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255, 193, 7, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>2️⃣</div>
            <div style={{ fontWeight: '600', color: '#ffc107' }}>Panchang Data</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Load astrological timing</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255, 107, 53, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>3️⃣</div>
            <div style={{ fontWeight: '600', color: '#ff6b35' }}>Generate Content</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Create propositions</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(40, 167, 69, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>4️⃣</div>
            <div style={{ fontWeight: '600', color: '#28a745' }}>Advanced Management</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Search & optimize</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>5️⃣</div>
            <div style={{ fontWeight: '600', color: '#667eea' }}>Team Review</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Collaborate & approve</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(118, 75, 162, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>6️⃣</div>
            <div style={{ fontWeight: '600', color: '#764ba2' }}>Analytics</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Track & improve</div>
          </div>
        </div>
        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
          Follow this workflow for optimal results, or jump to any section based on your current needs.
        </p>
      </div>

      {/* Footer Information */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '3rem', 
        padding: '2rem',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.9rem'
      }}>
        <p>
          Powered by professional AI prompts • Real API integration • Production-ready system
        </p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          Sri Mandir Puja Proposition Agent - Bridging Ancient Wisdom with Modern Technology
        </p>
      </div>
    </div>
  );
};

export default Dashboard;