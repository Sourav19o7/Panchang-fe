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
          {/* Market Gaps */}
          {result.analysis.competitiveAnalysis?.marketGaps && (
            <div className="result-item">
              <div className="result-header">
                <h5 className="result-title">🎯 Market Gaps Identified</h5>
              </div>
              <div className="result-content">
                <ul style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
                  {result.analysis.competitiveAnalysis.marketGaps.slice(0, 4).map((gap, index) => (
                    <li key={index} style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{gap}</li>
                  ))}
                </ul>
                {result.analysis.competitiveAnalysis.marketGaps.length > 4 && (
                  <p style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>
                    +{result.analysis.competitiveAnalysis.marketGaps.length - 4} more gaps identified
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Competitive Advantages */}
          {result.analysis.competitiveAnalysis?.competitiveAdvantages && (
            <div className="result-item">
              <div className="result-header">
                <h5 className="result-title">💪 Competitive Advantages</h5>
              </div>
              <div className="result-content">
                <div className="taglines">
                  {result.analysis.competitiveAnalysis.competitiveAdvantages.slice(0, 4).map((advantage, index) => (
                    <span key={index} className="tagline-item">{advantage}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Threat Assessment */}
          {result.analysis.competitiveAnalysis?.threatAssessment && (
            <div className="result-item">
              <div className="result-header">
                <h5 className="result-title">⚠️ Threat Assessment</h5>
              </div>
              <div className="result-content">
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {result.analysis.competitiveAnalysis.threatAssessment.length > 300 
                    ? `${result.analysis.competitiveAnalysis.threatAssessment.substring(0, 300)}...`
                    : result.analysis.competitiveAnalysis.threatAssessment
                  }
                </p>
              </div>
            </div>
          )}

          {/* Opportunity Mapping */}
          {result.analysis.competitiveAnalysis?.opportunityMapping && (
            <div className="result-item">
              <div className="result-header">
                <h5 className="result-title">🚀 Strategic Opportunities</h5>
              </div>
              <div className="result-content">
                <ul style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
                  {result.analysis.competitiveAnalysis.opportunityMapping.slice(0, 3).map((opportunity, index) => (
                    <li key={index} style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{opportunity}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Strategic Recommendations */}
          {result.analysis.strategicRecommendations && (
            <div className="result-item" style={{ gridColumn: '1 / -1' }}>
              <div className="result-header">
                <h5 className="result-title">📋 Strategic Recommendations</h5>
              </div>
              <div className="result-content">
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {result.analysis.strategicRecommendations.map((rec, index) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      background: 'rgba(102, 126, 234, 0.05)', 
                      borderRadius: '8px',
                      borderLeft: '4px solid #667eea'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ 
                          background: '#667eea', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          fontWeight: '600'
                        }}>
                          {rec.category}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>
                          Timeline: {rec.timeline}
                        </span>
                      </div>
                      <h6 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>{rec.recommendation}</h6>
                      <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0, color: '#555' }}>
                        {rec.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Innovation Workshop Results */}
      {key === 'innovation' && result.workshop && (
        <div className="results-grid">
          {/* Breakthrough Ideas */}
          {result.workshop.innovationResults?.breakthroughIdeas && (
            <div className="result-item">
              <div className="result-header">
                <h5 className="result-title">💡 Breakthrough Ideas</h5>
              </div>
              <div className="result-content">
                <ul style={{ marginLeft: '1rem' }}>
                  {result.workshop.innovationResults.breakthroughIdeas.slice(0, 3).map((idea, index) => (
                    <li key={index} style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{idea}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Incremental Improvements */}
          {result.workshop.innovationResults?.incrementalImprovements && (
            <div className="result-item">
              <div className="result-header">
                <h5 className="result-title">🔧 Incremental Improvements</h5>
              </div>
              <div className="result-content">
                <div className="taglines">
                  {result.workshop.innovationResults.incrementalImprovements.slice(0, 3).map((improvement, index) => (
                    <span key={index} className="tagline-item">{improvement}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Prioritized Innovations */}
          {result.workshop.prioritizedInnovations && (
            <div className="result-item" style={{ gridColumn: '1 / -1' }}>
              <div className="result-header">
                <h5 className="result-title">🎯 Prioritized Innovations</h5>
              </div>
              <div className="result-content">
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {result.workshop.prioritizedInnovations.map((innovation, index) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      background: 'rgba(255, 193, 7, 0.05)', 
                      borderRadius: '8px',
                      borderLeft: '4px solid #ffc107'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h6 style={{ margin: 0, fontWeight: '600' }}>{innovation.innovation}</h6>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ 
                            background: innovation.feasibility === 'high' ? '#28a745' : innovation.feasibility === 'medium' ? '#ffc107' : '#dc3545',
                            color: 'white', 
                            padding: '2px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.7rem'
                          }}>
                            {innovation.feasibility} feasibility
                          </span>
                          <span style={{ 
                            background: innovation.impact === 'high' ? '#28a745' : innovation.impact === 'medium' ? '#ffc107' : '#dc3545',
                            color: 'white', 
                            padding: '2px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.7rem'
                          }}>
                            {innovation.impact} impact
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0', color: '#555' }}>
                        Timeline: {innovation.timeline} | Resources: {innovation.resources}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* A/B Test Results */}
      {key === 'abtest' && result.testDesign && (
        <div className="results-grid">
          {/* Test Design Overview */}
          {result.testDesign.hypothesis && (
            <div className="result-item">
              <div className="result-header">
                <h5 className="result-title">🧪 Test Hypothesis</h5>
              </div>
              <div className="result-content">
                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#667eea' }}>
                  {result.testDesign.hypothesis}
                </p>
                {result.testDesign.testDuration && (
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                    Duration: {result.testDesign.testDuration} | Sample: {result.testDesign.sampleSize}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Variables and Groups */}
          {result.testDesign.variables && (
            <div className="result-item">
              <div className="result-header">
                <h5 className="result-title">🎛️ Test Variables</h5>
              </div>
              <div className="result-content">
                <div className="taglines">
                  {result.testDesign.variables.map((variable, index) => (
                    <span key={index} className="tagline-item">{variable}</span>
                  ))}
                </div>
                {result.testDesign.controlGroup && (
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
                    <strong>Control:</strong> {result.testDesign.controlGroup}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Success Metrics */}
          {result.testDesign.successMetrics && (
            <div className="result-item">
              <div className="result-header">
                <h5 className="result-title">📊 Success Metrics</h5>
              </div>
              <div className="result-content">
                <ul style={{ marginLeft: '1rem' }}>
                  {result.testDesign.successMetrics.map((metric, index) => (
                    <li key={index} style={{ fontSize: '0.9rem' }}>{metric}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Breakthrough Ideas Results */}
      {key === 'breakthrough' && result.ideas && (
        <div className="results-grid">
          {result.ideas.breakthroughConcepts?.map((idea, index) => (
            <div key={index} className="result-item">
              <div className="result-header">
                <h5 className="result-title">🚀 {idea.concept}</h5>
              </div>
              <div className="result-content">
                <p><strong>Innovation:</strong> {idea.innovation}</p>
                <p><strong>Description:</strong> {idea.description}</p>
                <p><strong>Spiritual Value:</strong> {idea.spiritualValue}</p>
                <p><strong>Technical Feasibility:</strong> {idea.technicalFeasibility}</p>
                <p><strong>Market Potential:</strong> {idea.marketPotential}</p>
                <div className="taglines" style={{ marginTop: '1rem' }}>
                  <span className="tagline-item">Risk: {idea.riskLevel || 'Medium'}</span>
                  <span className="tagline-item">Impact: {idea.impactScore || 'High'}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Implementation Roadmap */}
          {result.ideas.implementationRoadmap && (
            <div className="result-item" style={{ gridColumn: '1 / -1' }}>
              <div className="result-header">
                <h5 className="result-title">🗺️ Implementation Roadmap</h5>
              </div>
              <div className="result-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {Object.entries(result.ideas.implementationRoadmap).map(([phase, description], index) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      background: 'rgba(220, 53, 69, 0.05)', 
                      borderRadius: '8px',
                      borderLeft: '4px solid #dc3545'
                    }}>
                      <h6 style={{ margin: '0 0 0.5rem 0', fontWeight: '600', textTransform: 'capitalize' }}>
                        {phase.replace(/([A-Z])/g, ' $1').trim()}
                      </h6>
                      <p style={{ fontSize: '0.9rem', margin: 0, color: '#555' }}>{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prototype Results */}
      {key === 'prototype' && result.prototypeDesign && (
        <div className="results-grid">
          {/* Prototype Overview */}
          <div className="result-item" style={{ gridColumn: '1 / -1' }}>
            <div className="result-header">
              <h5 className="result-title">🛠️ Prototype Design</h5>
            </div>
            <div className="result-content">
              <h6 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{result.prototypeDesign.concept}</h6>
              
              {/* MVP Features */}
              {result.prototypeDesign.mvpFeatures && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>MVP Features:</strong>
                  <div className="taglines" style={{ marginTop: '0.5rem' }}>
                    {result.prototypeDesign.mvpFeatures.map((feature, index) => (
                      <span key={index} className="tagline-item">{feature}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* User Journey */}
              {result.prototypeDesign.userJourney && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>User Journey:</strong>
                  <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                    {result.prototypeDesign.userJourney.map((step, index) => (
                      <li key={index} style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Technical Requirements */}
              {result.prototypeDesign.technicalRequirements && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Technical Requirements:</strong>
                  <div className="taglines" style={{ marginTop: '0.5rem' }}>
                    {result.prototypeDesign.technicalRequirements.map((requirement, index) => (
                      <span key={index} className="tagline-item">{requirement}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Testing Approach */}
              {result.prototypeDesign.testingApproach && (
                <div>
                  <strong>Testing Approach:</strong>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#555' }}>
                    {result.prototypeDesign.testingApproach}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Development Plan */}
          {result.prototypeDesign.developmentPlan && (
            <div className="result-item" style={{ gridColumn: '1 / -1' }}>
              <div className="result-header">
                <h5 className="result-title">📅 Development Plan</h5>
              </div>
              <div className="result-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {Object.entries(result.prototypeDesign.developmentPlan).map(([phase, tasks], index) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      background: 'rgba(102, 126, 234, 0.05)', 
                      borderRadius: '8px',
                      borderLeft: '4px solid #667eea'
                    }}>
                      <h6 style={{ margin: '0 0 0.5rem 0', fontWeight: '600', textTransform: 'capitalize' }}>
                        {phase.replace(/([A-Z])/g, ' $1').trim()}
                      </h6>
                      {Array.isArray(tasks) ? (
                        <ul style={{ marginLeft: '1rem', fontSize: '0.85rem' }}>
                          {tasks.map((task, taskIndex) => (
                            <li key={taskIndex} style={{ marginBottom: '0.25rem' }}>{task}</li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: '0.9rem', margin: 0, color: '#555' }}>{tasks}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Seasonal Optimization Results */}
      {key === 'seasonal' && result.optimization && (
        <div className="results-grid">
          {/* Seasonal Recommendations */}
          {result.optimization.seasonalOptimization?.seasonalRecommendations && (
            <div className="result-item">
              <div className="result-header">
                <h5 className="result-title">🌟 Seasonal Recommendations</h5>
              </div>
              <div className="result-content">
                <ul style={{ marginLeft: '1rem' }}>
                  {result.optimization.seasonalOptimization.seasonalRecommendations.map((rec, index) => (
                    <li key={index} style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Festival Integration */}
          {result.optimization.seasonalOptimization?.festivalIntegration && (
            <div className="result-item">
              <div className="result-header">
                <h5 className="result-title">🎉 Festival Integration</h5>
              </div>
              <div className="result-content">
                <div className="taglines">
                  {result.optimization.seasonalOptimization.festivalIntegration.map((festival, index) => (
                    <span key={index} className="tagline-item">{festival}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Implementation Plan */}
          {result.optimization.implementationPlan && (
            <div className="result-item" style={{ gridColumn: '1 / -1' }}>
              <div className="result-header">
                <h5 className="result-title">📋 Implementation Plan</h5>
              </div>
              <div className="result-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {Object.entries(result.optimization.implementationPlan).map(([timeframe, actions], index) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      background: 'rgba(40, 167, 69, 0.05)', 
                      borderRadius: '8px',
                      borderLeft: '4px solid #28a745'
                    }}>
                      <h6 style={{ margin: '0 0 0.5rem 0', fontWeight: '600', textTransform: 'capitalize' }}>
                        {timeframe.replace(/([A-Z])/g, ' $1').trim()}
                      </h6>
                      {Array.isArray(actions) ? (
                        <ul style={{ marginLeft: '1rem', fontSize: '0.85rem' }}>
                          {actions.map((action, actionIndex) => (
                            <li key={actionIndex} style={{ marginBottom: '0.25rem' }}>{action}</li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: '0.9rem', margin: 0, color: '#555' }}>{actions}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generic JSON display for unknown result types */}
      {!['competitive', 'innovation', 'abtest', 'breakthrough', 'prototype', 'seasonal'].includes(key) && (
        <div className="result-item">
          <div className="result-header">
            <h5 className="result-title">📊 Analysis Results</h5>
          </div>
          <div className="result-content">
            <pre style={{ fontSize: '0.8rem', overflow: 'auto', background: '#f8f9fa', padding: '1rem', borderRadius: '6px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
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