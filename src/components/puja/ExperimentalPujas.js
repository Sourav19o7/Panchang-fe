
// ==================================================
// 9. src/components/puja/ExperimentalPujas.js
// ==================================================
import React, { useState, useEffect } from 'react';
import { Lightbulb, Beaker, TrendingUp } from 'lucide-react';
import pujaService from '../../services/pujaService';
import Loading from '../common/Loading';

const ExperimentalPujas = () => {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setExperiments([
          {
            id: 1,
            type: 'deity_combination',
            name: 'Ganesha-Lakshmi Prosperity Partnership',
            description: 'Combining obstacle removal with abundance for comprehensive business success',
            status: 'running',
            successMetrics: ['Business inquiries: +25%', 'Satisfaction: 4.7/5'],
            riskLevel: 'low'
          },
          {
            id: 2,
            type: 'timing_innovation',
            name: 'Pre-Dawn Power Hour Puja',
            description: '3:30 AM Brahma Muhurta timing for maximum spiritual receptivity',
            status: 'proposed',
            successMetrics: ['Participation rate', 'Spiritual experience feedback'],
            riskLevel: 'medium'
          },
          {
            id: 3,
            type: 'use_case_expansion',
            name: 'Digital Detox Hanuman Puja',
            description: 'Technology addiction recovery through Hanuman strength practices',
            status: 'completed',
            successMetrics: ['Digital usage: -40%', 'Mental clarity: +60%'],
            riskLevel: 'medium'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load experiments:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading experimental pujas..." />;
  }

  return (
    <div className="experimental-pujas">
      <div className="page-header">
        <h1 className="page-title">Experimental Pujas</h1>
        <p className="page-subtitle">Innovative puja concepts and their results</p>
      </div>

      <div className="experiments-grid">
        {experiments.map((experiment) => (
          <div key={experiment.id} className="experiment-card">
            <div className="experiment-header">
              <div className="experiment-icon">
                {experiment.type === 'deity_combination' && <Lightbulb />}
                {experiment.type === 'timing_innovation' && <Beaker />}
                {experiment.type === 'use_case_expansion' && <TrendingUp />}
              </div>
              <div>
                <h3>{experiment.name}</h3>
                <span className={`status-badge status-${experiment.status}`}>
                  {experiment.status}
                </span>
              </div>
            </div>

            <p className="experiment-description">{experiment.description}</p>

            <div className="experiment-metrics">
              <h4>Success Metrics:</h4>
              <ul>
                {experiment.successMetrics.map((metric, index) => (
                  <li key={index}>{metric}</li>
                ))}
              </ul>
            </div>

            <div className="experiment-footer">
              <span className={`risk-level risk-${experiment.riskLevel}`}>
                {experiment.riskLevel} risk
              </span>
              <div className="experiment-actions">
                <button className="btn btn-sm btn-primary">View Details</button>
                {experiment.status === 'proposed' && (
                  <button className="btn btn-sm btn-success">Approve</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperimentalPujas;