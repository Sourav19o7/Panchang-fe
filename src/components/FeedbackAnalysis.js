import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { BarChart3, TrendingUp, MessageSquare, Download, Calendar } from 'lucide-react';

const FeedbackAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('3_months');
  const [analysisType, setAnalysisType] = useState('performance');
  const [feedbackData, setFeedbackData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [historicalPropositions, setHistoricalPropositions] = useState([]);

  useEffect(() => {
    loadHistoricalData();
  }, []);

  const loadHistoricalData = async () => {
    try {
      const response = await api.getHistoricalPropositions({ limit: 10 });
      if (response.data.success) {
        setHistoricalPropositions(response.data.data);
      }
    } catch (error) {
      console.error('Error loading historical data:', error);
    }
  };

  const handleAnalyzePerformance = async () => {
    setAnalysisLoading(true);

    try {
      const currentDate = new Date();
      const response = await api.analyzePerformance({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        analysisType
      });
      
      if (response.data.success) {
        setAnalysis(response.data.data);
        toast.success('Performance analysis completed!');
      } else {
        toast.error(response.data.error || 'Failed to analyze performance');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze performance');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSynthesizeFeedback = async () => {
    setLoading(true);

    try {
      const response = await api.synthesizeFeedback({
        timeframe,
        categories: ['user_feedback', 'team_reviews', 'performance_metrics']
      });
      
      if (response.data.success) {
        setFeedbackData(response.data.data);
        toast.success('Feedback synthesis completed!');
      } else {
        toast.error(response.data.error || 'Failed to synthesize feedback');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to synthesize feedback');
    } finally {
      setLoading(false);
    }
  };

  const timeframes = [
    { value: '1_month', label: 'Last Month' },
    { value: '3_months', label: 'Last 3 Months' },
    { value: '6_months', label: 'Last 6 Months' },
    { value: '1_year', label: 'Last Year' }
  ];

  const analysisTypes = [
    { value: 'performance', label: 'Performance Analysis' },
    { value: 'feedback_synthesis', label: 'Feedback Synthesis' },
    { value: 'competitive', label: 'Competitive Analysis' },
    { value: 'seasonal', label: 'Seasonal Trends' }
  ];

  return (
    <div>
      {/* Analysis Controls */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 className="card-title">Performance Analysis</h2>
              <p className="card-description">
                Analyze performance metrics and generate insights from historical data.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Analysis Type</label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="form-input"
            >
              {analysisTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleAnalyzePerformance}
            className="btn btn-primary"
            disabled={analysisLoading}
            style={{ width: '100%' }}
          >
            {analysisLoading ? (
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', marginRight: '8px' }}></div>
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp size={18} />
                Run Analysis
              </>
            )}
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <MessageSquare size={24} />
            </div>
            <div>
              <h2 className="card-title">Feedback Synthesis</h2>
              <p className="card-description">
                Synthesize user feedback and team reviews to extract actionable insights.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="form-input"
            >
              {timeframes.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleSynthesizeFeedback}
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', marginRight: '8px' }}></div>
                Processing...
              </>
            ) : (
              <>
                <MessageSquare size={18} />
                Synthesize Feedback
              </>
            )}
          </button>
        </div>
      </div>

      {/* Historical Propositions */}
      <div className="results-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#333', fontSize: '1.4rem', fontWeight: '700' }}>
            Recent Propositions
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
            <Calendar size={16} />
            <span>Last 10 entries</span>
          </div>
        </div>

        <div className="results-grid">
          {historicalPropositions.map((proposition, index) => (
            <div key={index} className="result-item">
              <div className="result-header">
                <div>
                  <h4 className="result-title">
                    {proposition.proposition_data?.pujaName || `Proposition ${proposition.id}`}
                  </h4>
                  <div className="result-meta">
                    {proposition.proposition_data?.deity} • 
                    {proposition.month}/{proposition.year} • 
                    {new Date(proposition.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className={`status-badge status-${proposition.status === 'pending_review' ? 'pending' : proposition.status}`}>
                  {proposition.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="result-content">
                <div style={{ fontSize: '0.9rem' }}>
                  <strong>Use Case:</strong> {proposition.proposition_data?.useCase || 'N/A'}
                </div>
                {proposition.performance_score && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    <strong>Performance Score:</strong> {proposition.performance_score}/5
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {historicalPropositions.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No historical propositions found. Generate some propositions to see them here.
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="results-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#333', fontSize: '1.4rem', fontWeight: '700' }}>
              Analysis Results
            </h3>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              {analysis.dataPoints} data points analyzed
            </span>
          </div>

          <div className="result-item">
            <div className="result-header">
              <h4 className="result-title">
                <TrendingUp size={18} style={{ display: 'inline', marginRight: '8px' }} />
                Performance Insights
              </h4>
            </div>
            <div className="result-content">
              {typeof analysis.analysis === 'object' ? (
                <div>
                  <p><strong>Analysis Type:</strong> {analysisType.replace('_', ' ').toUpperCase()}</p>
                  <p style={{ marginTop: '1rem' }}>
                    Analysis completed with {analysis.dataPoints} data points. 
                    Detailed insights have been generated based on historical performance patterns.
                  </p>
                  {analysis.analysis.keyFindings && (
                    <div style={{ marginTop: '1rem' }}>
                      <strong>Key Findings:</strong>
                      <p>{analysis.analysis.keyFindings}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p>{analysis.analysis}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Synthesis Results */}
      {feedbackData && (
        <div className="results-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#333', fontSize: '1.4rem', fontWeight: '700' }}>
              Feedback Synthesis
            </h3>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              {timeframe.replace('_', ' ')} timeframe
            </span>
          </div>

          <div className="results-grid">
            <div className="result-item">
              <div className="result-header">
                <h4 className="result-title">Data Summary</h4>
              </div>
              <div className="result-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <strong>User Feedback:</strong> {feedbackData.dataPoints?.userFeedback || 0}
                  </div>
                  <div>
                    <strong>Team Reviews:</strong> {feedbackData.dataPoints?.teamReviews || 0}
                  </div>
                  <div>
                    <strong>Performance Metrics:</strong> {feedbackData.dataPoints?.performanceMetrics || 0}
                  </div>
                  <div>
                    <strong>Conversion Data:</strong> {feedbackData.dataPoints?.conversionData || 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="result-item">
              <div className="result-header">
                <h4 className="result-title">
                  <MessageSquare size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  Synthesis Insights
                </h4>
              </div>
              <div className="result-content">
                {typeof feedbackData.synthesis === 'object' ? (
                  <div>
                    <p>Comprehensive feedback analysis completed for the selected timeframe.</p>
                    {feedbackData.synthesis.summary && (
                      <div style={{ marginTop: '1rem' }}>
                        <strong>Summary:</strong>
                        <p>{feedbackData.synthesis.summary}</p>
                      </div>
                    )}
                    {feedbackData.synthesis.recommendations && (
                      <div style={{ marginTop: '1rem' }}>
                        <strong>Recommendations:</strong>
                        <p>{feedbackData.synthesis.recommendations}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{feedbackData.synthesis}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackAnalysis;