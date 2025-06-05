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
  Rocket
} from 'lucide-react';
import FocusSuggestion from './FocusSuggestion';
import PanchangGenerator from './PanchangGenerator';
import PropositionGenerator from './PropositionGenerator';
import FeedbackAnalysis from './FeedbackAnalysis';
import AdvancedAnalytics from './AdvancedAnalytics';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('focus');

  const tabs = [
    { id: 'focus', name: 'Focus Suggestion', icon: Brain, component: FocusSuggestion },
    { id: 'panchang', name: 'Panchang Data', icon: Calendar, component: PanchangGenerator },
    { id: 'propositions', name: 'Generate Pujas', icon: Sparkles, component: PropositionGenerator },
    { id: 'feedback', name: 'Feedback & Analysis', icon: BarChart3, component: FeedbackAnalysis },
    { id: 'advanced', name: 'Advanced Analytics', icon: Rocket, component: AdvancedAnalytics },
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

      {/* Active Component */}
      <div style={{ minHeight: '500px' }}>
        {ActiveComponent && <ActiveComponent />}
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