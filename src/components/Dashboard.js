import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  FileText, 
  BarChart3, 
  Upload,
  Download,
  Brain,
  Users
} from 'lucide-react';
import FocusSuggestion from './FocusSuggestion';
import PanchangGenerator from './PanchangGenerator';
import PropositionGenerator from './PropositionGenerator';
import FeedbackAnalysis from './FeedbackAnalysis';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('focus');

  const tabs = [
    { id: 'focus', name: 'Focus Suggestion', icon: Brain, component: FocusSuggestion },
    { id: 'panchang', name: 'Panchang Data', icon: Calendar, component: PanchangGenerator },
    { id: 'propositions', name: 'Generate Pujas', icon: Sparkles, component: PropositionGenerator },
    { id: 'feedback', name: 'Feedback & Analysis', icon: BarChart3, component: FeedbackAnalysis },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Puja Proposition Agent</h1>
        <p className="dashboard-subtitle">
          Automate your spiritual content creation with AI-powered insights
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
        gap: '1rem',
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
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                flex: '1',
                minWidth: '180px',
                justifyContent: 'center'
              }}
            >
              <Icon size={18} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Active Component */}
      <div style={{ minHeight: '500px' }}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default Dashboard;