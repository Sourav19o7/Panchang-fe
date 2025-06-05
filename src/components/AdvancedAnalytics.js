import React, { useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { 
  Lightbulb, 
  TrendingUp, 
  Zap, 
  Target, 
  Rocket,
  Brain,
  Users,
  BarChart3,
  Sparkles
} from 'lucide-react';

const AdvancedAnalytics = () => {
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});

  const setLoadingState = (key, state) => {
    setLoading(prev => ({ ...prev, [key]: state }));
  };

  const setResult = (key, data) => {
    setResults(prev => ({ ...prev, [key]: data }));
  };

  // Competitive Analysis
  const handleCompetitiveAnalysis = async () => {
    setLoadingState('competitive', true);
    try {
      const response = await api.performCompetitiveAnalysis({
        competitorData: [
          { name: 'Competitor A', strengths: ['Brand recognition', 'Wide reach'], weaknesses: ['Limited personalization'] },
          { name: 'Competitor B', strengths: ['Technology focus', 'Modern UX'], weaknesses: ['Cultural authenticity'] }
        ],
        marketTrends: ['Digital spirituality growth', 'Personalization demand', 'Mobile-first approach'],
        userPreferences: ['Authentic experiences', 'Convenience', 'Community connection']
      });

      if (response.data.success) {
        setResult('competitive', response.data.data);
        toast.success('Competitive analysis completed!');
      }
    } catch (error) {
      toast.error('Failed to perform competitive analysis');
    } finally {
      setLoadingState('competitive', false);
    }
  };

  // Seasonal Strategy Optimization
  const handleSeasonalOptimization = async () => {
    setLoadingState('seasonal', true);
    try {
      const currentMonth = new Date().getMonth() + 1;
      const response = await api.optimizeSeasonalStrategy({
        season: currentMonth >= 3 && currentMonth <= 5 ? 'spring' : 
               currentMonth >= 6 && currentMonth <= 8 ? 'summer' :
               currentMonth >= 9 && currentMonth <= 11 ? 'autumn' : 'winter',
        month: currentMonth,
        year: new Date().getFullYear()
      });

      if (response.data.success) {
        setResult('seasonal', response.data.data);
        toast.success('Seasonal strategy optimized!');
      }
    } catch (error) {
      toast.error('Failed to optimize seasonal strategy');
    } finally {
      setLoadingState('seasonal', false);
    }
  };

  // Innovation Workshop
  const handleInnovationWorkshop = async () => {
    setLoadingState('innovation', true);
    try {
      const response = await api.conductInnovationWorkshop({
        currentOfferings: ['Traditional pujas', 'Festival calendars', 'Spiritual guidance'],
        marketGaps: ['Youth engagement', 'Digital integration', 'Personalized experiences'],
        emergingTrends: ['AI spirituality', 'Virtual reality temples', 'Micro-spiritual moments'],
        techOpportunities: ['Machine learning', 'AR/VR', 'IoT sensors', 'Blockchain']
      });

      if (response.data.success) {
        setResult('innovation', response.data.data);
        toast.success('Innovation workshop completed!');
      }
    } catch (error) {
      toast.error('Failed to conduct innovation workshop');
    } finally {
      setLoadingState('innovation', false);
    }
  };

  // A/B Test Design
  const handleABTestDesign = async () => {
    setLoadingState('abtest', true);
    try {
      const response = await api.designABTest({
        currentPerformance: { ctr: 0.045, conversion: 0.012, satisfaction: 4.2 },
        hypothesis: 'Personalized timing recommendations will increase engagement',
        targetMetrics: ['CTR', 'conversion_rate', 'user_satisfaction', 'retention'],
        audienceSegments: ['new_users', 'returning_users', 'premium_users'],
        testPeriod: '4_weeks'
      });

      if (response.data.success) {
        setResult('abtest', response.data.data);
        toast.success('A/B test designed successfully!');
      }
    } catch (error) {
      toast.error('Failed to design A/B test');
    } finally {
      setLoadingState('abtest', false);
    }
  };

  // Breakthrough Ideas
  const handleBreakthroughIdeas = async () => {
    setLoadingState('breakthrough', true);
    try {
      const response = await api.generateBreakthroughIdeas({
        emergingTech: ['GPT-4 AI', 'Quantum computing', 'Brain-computer interfaces', 'Holographic displays'],
        culturalTrends: ['Neo-spirituality', 'Wellness integration', 'Community healing', 'Digital detox'],
        behaviorShifts: ['Attention fragmentation', 'Experience economy', 'Authenticity seeking'],
        globalTrends: ['Climate consciousness', 'Mental health focus', 'Purpose-driven living'],
        generationalData: { 
          gen_z: 'Technology-native, purpose-driven',
          millennials: 'Experience-focused, wellness-oriented',
          gen_x: 'Efficiency-minded, family-centered'
        }
      });

      if (response.data.success) {
        setResult('breakthrough', response.data.data);
        toast.success('Breakthrough ideas generated!');
      }
    } catch (error) {
      toast.error('Failed to generate breakthrough ideas');
    } finally {
      setLoadingState('breakthrough', false);
    }
  };

  // Rapid Prototype Design
  const handleRapidPrototype = async () => {
    setLoadingState('prototype', true);
    try {
      const response = await api.designRapidPrototype({
        conceptDetails: {
          name: 'AI-Powered Personal Spiritual Assistant',
          description: 'Intelligent system that learns user preferences and suggests personalized spiritual practices',
          targetAudience: 'Tech-savvy spiritual seekers aged 25-45'
        },
        resources: ['Small development team', 'Limited budget', 'Cloud infrastructure'],
        timeline: '6_weeks',
        successMetrics: ['User engagement', 'Personalization accuracy', 'Spiritual satisfaction'],
        riskLevel: 'medium'
      });

      if (response.data.success) {
        setResult('prototype', response.data.data);
        toast.success('Rapid prototype designed!');
      }
    } catch (error) {
      toast.error('Failed to design rapid prototype');
    } finally {
      setLoadingState('prototype', false);
    }
  };

  const analysisTools = [
    {
      id: 'competitive',
      title: 'Competitive Analysis',
      description: 'Analyze market positioning and competitive landscape',
      icon: TrendingUp,
      color: 'bg-blue-500',
      handler: handleCompetitiveAnalysis
    },
    {
      id: 'seasonal',
      title: 'Seasonal Strategy',
      description: 'Optimize puja calendar for seasonal relevance',
      icon: Target,
      color: 'bg-green-500',
      handler: handleSeasonalOptimization
    },
    {
      id: 'innovation',
      title: 'Innovation Workshop',
      description: 'Generate breakthrough puja proposition ideas',
      icon: Lightbulb,
      color: 'bg-yellow-500',
      handler: handleInnovationWorkshop
    }
  ];

  const experimentTools = [
    {
      id: 'abtest',
      title: 'A/B Test Design',
      description: 'Design experiments to optimize performance',
      icon: BarChart3,
      color: 'bg-purple-500',
      handler: handleABTestDesign
    },
    {
      id: 'breakthrough',
      title: 'Breakthrough Ideas',
      description: 'Generate revolutionary spiritual technology concepts',
      icon: Rocket,
      color: 'bg-red-500',
      handler: handleBreakthroughIdeas
    },
    {
      id: 'prototype',
      title: 'Rapid Prototype',
      description: 'Design rapid prototyping approach for new concepts',
      icon: Zap,
      color: 'bg-indigo-500',
      handler: handleRapidPrototype
    }
  ];

  const renderResults = (key) => {
    const result = results[key];
    if (!result) return null;

    return (
      <div className="results-section" style={{ marginTop: '1rem' }}>
        <h4 style={{ color: '#333', marginBottom: '1rem' }}>Results:</h4>
        
        {/* Competitive Analysis Results */}
        {key === 'competitive' && result.analysis && (
          <div className="results-grid">
            {result.analysis.marketGaps?.map((gap, index) => (
              <div key={index} className="result-item">
                <h5 className="result-title">Market Gap {index + 1}</h5>
                <p>{gap}</p>
              </div>
            ))}
            {result.analysis.recommendations?.map((rec, index) => (
              <div key={index} className="result-item">
                <h5 className="result-title">Recommendation {index + 1}</h5>
                <p>{rec}</p>
              </div>
            ))}
          </div>
        )}

        {/* Innovation Workshop Results */}
        {key === 'innovation' && result.workshop && (
          <div className="results-grid">
            {result.workshop.concepts?.map((concept, index) => (
              <div key={index} className="result-item">
                <h5 className="result-title">{concept.name}</h5>
                <p><strong>Innovation:</strong> {concept.innovation}</p>
                <p><strong>Feasibility:</strong> {concept.feasibility}</p>
                <p><strong>Market Potential:</strong> {concept.marketPotential}</p>
              </div>
            ))}
          </div>
        )}

        {/* A/B Test Results */}
        {key === 'abtest' && result.testDesign && (
          <div className="results-grid">
            {result.testDesign.tests?.map((test, index) => (
              <div key={index} className="result-item">
                <h5 className="result-title">{test.testName}</h5>
                <p><strong>Hypothesis:</strong> {test.hypothesis}</p>
                <p><strong>Methodology:</strong> {test.methodology}</p>
                <p><strong>Success Criteria:</strong> {test.successCriteria}</p>
              </div>
            ))}
          </div>
        )}

        {/* Breakthrough Ideas Results */}
        {key === 'breakthrough' && result.ideas && (
          <div className="results-grid">
            {result.ideas.concepts?.map((idea, index) => (
              <div key={index} className="result-item">
                <h5 className="result-title">{idea.name}</h5>
                <p><strong>Category:</strong> {idea.category}</p>
                <p><strong>Description:</strong> {idea.description}</p>
                <p><strong>Disruptive Potential:</strong> {idea.disruptivePotential}</p>
                <div className="taglines">
                  <span className="tagline-item">Risk: {idea.riskLevel || 'Medium'}</span>
                  <span className="tagline-item">Impact: {idea.impactScore || 'High'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prototype Results */}
        {key === 'prototype' && result.prototypeDesign && (
          <div className="result-item">
            <h5 className="result-title">Prototype Plan</h5>
            <p><strong>Scope:</strong> {result.prototypeDesign.scope}</p>
            <p><strong>Timeline:</strong> {result.prototypeDesign.timeline}</p>
            <p><strong>Success Metrics:</strong> {result.prototypeDesign.successMetrics?.join(', ')}</p>
            {result.prototypeDesign.milestones && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Milestones:</strong>
                <div className="taglines">
                  {result.prototypeDesign.milestones.map((milestone, index) => (
                    <span key={index} className="tagline-item">{milestone}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generic JSON display for other results */}
        {!['competitive', 'innovation', 'abtest', 'breakthrough', 'prototype'].includes(key) && (
          <div className="result-item">
            <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Advanced Analysis Section */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">
            <Brain size={24} />
          </div>
          <div>
            <h2 className="card-title">Advanced Analysis & Strategy</h2>
            <p className="card-description">
              Professional-grade analytics using advanced AI prompts for strategic insights.
            </p>
          </div>
        </div>

        <div className="dashboard-grid">
          {analysisTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div key={tool.id} className="card" style={{ margin: 0 }}>
                <div className="card-header">
                  <div className={`card-icon ${tool.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{tool.title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                  {tool.description}
                </p>
                <button
                  onClick={tool.handler}
                  disabled={loading[tool.id]}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {loading[tool.id] ? (
                    <>
                      <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Icon size={16} />
                      Run Analysis
                    </>
                  )}
                </button>
                {renderResults(tool.id)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Innovation & Experimentation Section */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="card-title">Innovation & Experimentation</h2>
            <p className="card-description">
              Generate breakthrough ideas and design experiments for revolutionary spiritual experiences.
            </p>
          </div>
        </div>

        <div className="dashboard-grid">
          {experimentTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div key={tool.id} className="card" style={{ margin: 0 }}>
                <div className="card-header">
                  <div className={`card-icon ${tool.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{tool.title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                  {tool.description}
                </p>
                <button
                  onClick={tool.handler}
                  disabled={loading[tool.id]}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {loading[tool.id] ? (
                    <>
                      <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Icon size={16} />
                      Generate
                    </>
                  )}
                </button>
                {renderResults(tool.id)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Professional Insights Panel */}
      <div className="results-section">
        <h3 style={{ color: '#333', fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>
          🧠 Professional AI Insights
        </h3>
        <div style={{ 
          background: 'rgba(102, 126, 234, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '15px',
          marginBottom: '1rem'
        }}>
          <h4 style={{ color: '#667eea', margin: '0 0 1rem 0' }}>Advanced Prompt System Active</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>12+</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Professional Prompts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>400+</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Word Rationales</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>5-Part</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Proposition Structure</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>AI+</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Fallback System</div>
            </div>
          </div>
        </div>
        
        <div style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <p>
            This system uses professionally-crafted prompts to generate high-quality spiritual content. 
            Each analysis leverages specialized AI templates designed for maximum cultural authenticity 
            and strategic insight. The system automatically provides intelligent fallbacks when AI services 
            are unavailable, ensuring consistent operation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;