

// ==================================================
// 7. src/components/puja/PujaList.js
// ==================================================
import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pujaService from '../../services/pujaService';
import Loading from '../common/Loading';

const PujaList = () => {
  const navigate = useNavigate();
  const [pujas, setPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: '',
    deity: ''
  });

  useEffect(() => {
    loadPujas();
  }, [filters]);

  const loadPujas = async () => {
    try {
      setLoading(true);
      const result = await pujaService.getHistoricalPropositions(filters);
      if (result.success) {
        setPujas(result.data);
      }
    } catch (error) {
      console.error('Failed to load pujas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <Loading message="Loading pujas..." />;
  }

  return (
    <div className="puja-list">
      <div className="page-header">
        <div>
          <h1 className="page-title">Puja Calendar</h1>
          <p className="page-subtitle">Manage your puja propositions</p>
        </div>
        <button 
          onClick={() => navigate('/puja/generate')}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Generate New
        </button>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            className="form-select"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2023, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          
          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="form-select"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={2022 + i} value={2022 + i}>
                {2022 + i}
              </option>
            ))}
          </select>
          
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="">All Status</option>
            <option value="pending_review">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button className="btn btn-outline">
            <Filter size={16} />
            More Filters
          </button>
        </div>
      </div>

      <div className="pujas-grid">
        {pujas.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No pujas found</h3>
            <p>Generate your first puja propositions to get started</p>
          </div>
        ) : (
          pujas.map((puja) => (
            <div key={puja.id} className="puja-card">
              <div className="puja-header">
                <h3>{puja.proposition_data?.pujaName || 'Unnamed Puja'}</h3>
                <span className={`status-badge status-${puja.status}`}>
                  {puja.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="puja-details">
                <p><strong>Date:</strong> {new Date(puja.date).toLocaleDateString()}</p>
                <p><strong>Deity:</strong> {puja.proposition_data?.deity}</p>
                <p><strong>Use Case:</strong> {puja.proposition_data?.useCase}</p>
                {puja.performance_score && (
                  <p><strong>Score:</strong> {puja.performance_score}/5.0</p>
                )}
              </div>
              
              <div className="puja-actions">
                <button className="btn btn-sm btn-primary">View</button>
                <button className="btn btn-sm btn-outline">Edit</button>
                <button className="btn btn-sm btn-outline">Export</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PujaList;