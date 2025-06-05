// src/components/AdvancedPropositionManager.js
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Edit, 
  Copy, 
  Trash2, 
  MoreHorizontal,
  ChevronDown,
  RefreshCw,
  Download,
  Upload,
  Star,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Zap,
  Settings
} from 'lucide-react';

const AdvancedPropositionManager = () => {
  const [loading, setLoading] = useState(false);
  const [propositions, setPropositions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPropositions, setSelectedPropositions] = useState(new Set());
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });
  
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    deity: '',
    useCase: '',
    status: '',
    month: '',
    year: new Date().getFullYear(),
    performanceMin: '',
    performanceMax: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const [activeTab, setActiveTab] = useState('search');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [analysisResults, setAnalysisResults] = useState({});
  const [experimentResults, setExperimentResults] = useState({});

  useEffect(() => {
    if (activeTab === 'search') {
      handleSearch();
    }
  }, [searchFilters, activeTab]);

  // =====================================
  // SEARCH & FILTER OPERATIONS
  // =====================================

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.searchPropositions(searchFilters);
      
      if (response.data.success) {
        setSearchResults(response.data.data);
        setPagination({
          total: response.data.total,
          hasMore: response.data.pagination.hasMore
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      query: '',
      deity: '',
      useCase: '',
      status: '',
      month: '',
      year: new Date().getFullYear(),
      performanceMin: '',
      performanceMax: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  // =====================================
  // PROPOSITION OPERATIONS
  // =====================================

  const handleStatusUpdate = async (propositionId, status, notes = '') => {
    try {
      const response = await api.updatePropositionStatus(propositionId, {
        status,
        notes
      });
      
      if (response.data.success) {
        toast.success('Status updated successfully');
        handleSearch(); // Refresh results
      }
    } catch (error) {
      console.error('Status update failed:', error);
      toast.error('Failed to update status');
    }
  };

  const handleClone = async (propositionId, modifications = {}) => {
    try {
      const response = await api.cloneProposition(propositionId, {
        newDate: new Date().toISOString().split('T')[0],
        modifications
      });
      
      if (response.data.success) {
        toast.success('Proposition cloned successfully');
        handleSearch();
      }
    } catch (error) {
      console.error('Clone failed:', error);
      toast.error('Failed to clone proposition');
    }
  };

  const handleDelete = async (propositionId) => {
    if (!window.confirm('Are you sure you want to delete this proposition?')) {
      return;
    }

    try {
      await api.deleteProposition(propositionId);
      toast.success('Proposition deleted successfully');
      handleSearch();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete proposition');
    }
  };

  const handleGenerateVariations = async (propositionId, variationType = 'deity_swap') => {
    try {
      setLoading(true);
      const response = await api.generatePropositionVariations(propositionId, {
        variationType,
        count: 3
      });
      
      if (response.data.success) {
        setAnalysisResults(prev => ({
          ...prev,
          variations: response.data.data
        }));
        toast.success('Variations generated successfully');
      }
    } catch (error) {
      console.error('Variation generation failed:', error);
      toast.error('Failed to generate variations');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdate = async (status, notes = '') => {
    if (selectedPropositions.size === 0) {
      toast.error('Please select propositions to update');
      return;
    }

    try {
      const response = await api.bulkUpdatePropositions({
        propositionIds: Array.from(selectedPropositions),
        updates: { status, team_notes: notes }
      });
      
      if (response.data.success) {
        toast.success(`Updated ${selectedPropositions.size} propositions`);
        setSelectedPropositions(new Set());
        handleSearch();
      }
    } catch (error) {
      console.error('Bulk update failed:', error);
      toast.error('Failed to update propositions');
    }
  };

  // =====================================
  // ADVANCED ANALYSIS OPERATIONS
  // =====================================

  const handleWhyWhyAnalysis = async (proposition) => {
    try {
      setLoading(true);
      const response = await api.generateWhyWhyAnalysis({
        pujaName: proposition.proposition_data?.pujaName,
        dateInfo: proposition.date,
        deity: proposition.proposition_data?.deity,
        useCase: proposition.proposition_data?.useCase,
        propositionId: proposition.id
      });
      
      if (response.data.success) {
        setAnalysisResults(prev => ({
          ...prev,
          whyWhy: response.data.data
        }));
        toast.success('Why-Why analysis completed');
      }
    } catch (error) {
      console.error('Why-Why analysis failed:', error);
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePerformanceAnalysis = async () => {
    try {
      setLoading(true);
      const response = await api.analyzePerformance({
        month: searchFilters.month || new Date().getMonth() + 1,
        year: searchFilters.year,
        analysisType: 'comprehensive'
      });
      
      if (response.data.success) {
        setAnalysisResults(prev => ({
          ...prev,
          performance: response.data.data
        }));
        toast.success('Performance analysis completed');
      }
    } catch (error) {
      console.error('Performance analysis failed:', error);
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitiveAnalysis = async () => {
    try {
      setLoading(true);
      const response = await api.performCompetitiveAnalysis({
        marketData: {
          segment: 'spiritual_content',
          region: 'india',
          userBase: 'modern_devotees'
        }
      });
      
      if (response.data.success) {
        setAnalysisResults(prev => ({
          ...prev,
          competitive: response.data.data
        }));
        toast.success('Competitive analysis completed');
      }
    } catch (error) {
      console.error('Competitive analysis failed:', error);
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // INNOVATION & EXPERIMENTATION
  // =====================================

  const handleInnovationWorkshop = async () => {
    try {
      setLoading(true);
      const response = await api.conductInnovationWorkshop({
        innovationData: {
          currentTrends: ['AI personalization', 'Virtual reality', 'Community features'],
          targetAudience: 'tech-savvy spiritual seekers',
          constraints: ['cultural authenticity', 'scalability']
        }
      });
      
      if (response.data.success) {
        setExperimentResults(prev => ({
          ...prev,
          innovation: response.data.data
        }));
        toast.success('Innovation workshop completed');
      }
    } catch (error) {
      console.error('Innovation workshop failed:', error);
      toast.error('Workshop failed');
    } finally {
      setLoading(false);
    }
  };

  const handleABTestDesign = async () => {
    try {
      setLoading(true);
      const response = await api.designABTest({
        testData: {
          hypothesis: 'Personalized content increases engagement',
          metrics: ['engagement_rate', 'completion_rate', 'user_satisfaction'],
          duration: '4_weeks'
        }
      });
      
      if (response.data.success) {
        setExperimentResults(prev => ({
          ...prev,
          abTest: response.data.data
        }));
        toast.success('A/B test design completed');
      }
    } catch (error) {
      console.error('A/B test design failed:', error);
      toast.error('Test design failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBreakthroughIdeas = async () => {
    try {
      setLoading(true);
      const response = await api.generateBreakthroughIdeas({
        innovationParameters: {
          emergingTech: ['AI', 'VR', 'Blockchain', 'IoT'],
          culturalTrends: ['digital spirituality', 'personalization'],
          targetInnovation: 'revolutionary spiritual experiences'
        }
      });
      
      if (response.data.success) {
        setExperimentResults(prev => ({
          ...prev,
          breakthrough: response.data.data
        }));
        toast.success('Breakthrough ideas generated');
      }
    } catch (error) {
      console.error('Breakthrough ideas failed:', error);
      toast.error('Idea generation failed');
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UI HELPER FUNCTIONS
  // =====================================

  const togglePropositionSelection = (id) => {
    const newSelection = new Set(selectedPropositions);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedPropositions(newSelection);
  };

  const selectAll = () => {
    if (selectedPropositions.size === searchResults.length) {
      setSelectedPropositions(new Set());
    } else {
      setSelectedPropositions(new Set(searchResults.map(p => p.id)));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending_review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'needs_revision': 'bg-orange-100 text-orange-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // =====================================
  // RENDER COMPONENTS
  // =====================================

  const renderSearchFilters = () => (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">
          <Search size={24} />
        </div>
        <div>
          <h2 className="card-title">Advanced Search & Management</h2>
          <p className="card-description">
            Search, filter, and manage propositions with advanced operations.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search propositions..."
          value={searchFilters.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          className="form-input"
          style={{ flex: 1 }}
        />
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Filter size={16} />
          Filters
          <ChevronDown size={16} />
        </button>
        <button
          onClick={clearFilters}
          className="btn"
        >
          Clear
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div style={{ 
          background: 'rgba(248, 249, 250, 1)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <select
              value={searchFilters.deity}
              onChange={(e) => handleFilterChange('deity', e.target.value)}
              className="form-input"
            >
              <option value="">All Deities</option>
              <option value="Ganesha">Ganesha</option>
              <option value="Shiva">Shiva</option>
              <option value="Vishnu">Vishnu</option>
              <option value="Durga">Durga</option>
              <option value="Lakshmi">Lakshmi</option>
              <option value="Saraswati">Saraswati</option>
            </select>

            <select
              value={searchFilters.useCase}
              onChange={(e) => handleFilterChange('useCase', e.target.value)}
              className="form-input"
            >
              <option value="">All Use Cases</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Career Growth">Career Growth</option>
              <option value="Financial Prosperity">Financial Prosperity</option>
              <option value="Relationship Harmony">Relationship Harmony</option>
            </select>

            <select
              value={searchFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-input"
            >
              <option value="">All Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="needs_revision">Needs Revision</option>
            </select>

            <input
              type="number"
              placeholder="Min Performance"
              value={searchFilters.performanceMin}
              onChange={(e) => handleFilterChange('performanceMin', e.target.value)}
              className="form-input"
              min="1"
              max="5"
              step="0.1"
            />
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem',
        background: 'rgba(102, 126, 234, 0.1)',
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <span style={{ fontWeight: '600' }}>
          {pagination.total} propositions found
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={searchFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="form-input"
            style={{ minWidth: '150px' }}
          >
            <option value="created_at">Date Created</option>
            <option value="performance_score">Performance</option>
            <option value="status">Status</option>
          </select>
          <button
            onClick={() => handleFilterChange('sortOrder', searchFilters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn"
          >
            {searchFilters.sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPropositionList = () => (
    <div className="results-section">
      {/* Bulk Actions */}
      {selectedPropositions.size > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '600' }}>
              {selectedPropositions.size} selected
            </span>
            
            <button
              onClick={() => handleBulkUpdate('approved')}
              className="btn"
              style={{ background: '#28a745', color: 'white' }}
            >
              Approve All
            </button>
            
            <button
              onClick={() => handleBulkUpdate('rejected')}
              className="btn"
              style={{ background: '#dc3545', color: 'white' }}
            >
              Reject All
            </button>
            
            <button
              onClick={() => handleBulkUpdate('needs_revision')}
              className="btn"
              style={{ background: '#ffc107', color: 'white' }}
            >
              Mark for Revision
            </button>
          </div>
        </div>
      )}

      {/* Proposition Grid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Search Results</h3>
        <button
          onClick={selectAll}
          className="btn"
        >
          {selectedPropositions.size === searchResults.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p>Loading propositions...</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No propositions found. Try adjusting your search filters.
        </div>
      ) : (
        <div className="results-grid">
          {searchResults.map((proposition) => (
            <PropositionCard
              key={proposition.id}
              proposition={proposition}
              isSelected={selectedPropositions.has(proposition.id)}
              onToggleSelect={() => togglePropositionSelection(proposition.id)}
              onStatusUpdate={handleStatusUpdate}
              onClone={handleClone}
              onDelete={handleDelete}
              onGenerateVariations={handleGenerateVariations}
              onWhyWhyAnalysis={handleWhyWhyAnalysis}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalysisResults = () => (
    <div className="results-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Advanced Analysis</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handlePerformanceAnalysis}
            disabled={loading}
            className="btn btn-primary"
          >
            <BarChart3 size={16} />
            Performance
          </button>
          <button
            onClick={handleCompetitiveAnalysis}
            disabled={loading}
            className="btn"
          >
            <TrendingUp size={16} />
            Competitive
          </button>
        </div>
      </div>

      {/* Analysis Results Grid */}
      <div className="results-grid">
        {analysisResults.performance && (
          <AnalysisResultCard
            title="Performance Analysis"
            icon={<BarChart3 size={18} />}
            data={analysisResults.performance}
            type="performance"
          />
        )}

        {analysisResults.competitive && (
          <AnalysisResultCard
            title="Competitive Analysis"
            icon={<TrendingUp size={18} />}
            data={analysisResults.competitive}
            type="competitive"
          />
        )}

        {analysisResults.whyWhy && (
          <AnalysisResultCard
            title="Why-Why Analysis"
            icon={<Lightbulb size={18} />}
            data={analysisResults.whyWhy}
            type="whyWhy"
          />
        )}

        {analysisResults.variations && (
          <AnalysisResultCard
            title="Proposition Variations"
            icon={<RefreshCw size={18} />}
            data={analysisResults.variations}
            type="variations"
          />
        )}
      </div>
    </div>
  );

  const renderExperimentResults = () => (
    <div className="results-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Innovation & Experiments</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleInnovationWorkshop}
            disabled={loading}
            className="btn btn-primary"
          >
            <Lightbulb size={16} />
            Innovation
          </button>
          <button
            onClick={handleABTestDesign}
            disabled={loading}
            className="btn"
          >
            <Settings size={16} />
            A/B Test
          </button>
          <button
            onClick={handleBreakthroughIdeas}
            disabled={loading}
            className="btn"
          >
            <Zap size={16} />
            Breakthrough
          </button>
        </div>
      </div>

      {/* Experiment Results Grid */}
      <div className="results-grid">
        {experimentResults.innovation && (
          <ExperimentResultCard
            title="Innovation Workshop"
            icon={<Lightbulb size={18} />}
            data={experimentResults.innovation}
            type="innovation"
          />
        )}

        {experimentResults.abTest && (
          <ExperimentResultCard
            title="A/B Test Design"
            icon={<Settings size={18} />}
            data={experimentResults.abTest}
            type="abTest"
          />
        )}

        {experimentResults.breakthrough && (
          <ExperimentResultCard
            title="Breakthrough Ideas"
            icon={<Zap size={18} />}
            data={experimentResults.breakthrough}
            type="breakthrough"
          />
        )}
      </div>
    </div>
  );

  // =====================================
  // MAIN RENDER
  // =====================================

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '1rem',
        borderRadius: '15px'
      }}>
        {[
          { id: 'search', label: 'Search & Manage', icon: Search },
          { id: 'analysis', label: 'Advanced Analysis', icon: BarChart3 },
          { id: 'experiments', label: 'Innovation Lab', icon: Lightbulb }
        ].map(tab => {
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
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'search' && (
        <>
          {renderSearchFilters()}
          {renderPropositionList()}
        </>
      )}

      {activeTab === 'analysis' && renderAnalysisResults()}
      {activeTab === 'experiments' && renderExperimentResults()}
    </div>
  );
};

// =====================================
// PROPOSITION CARD COMPONENT
// =====================================

const PropositionCard = ({ 
  proposition, 
  isSelected, 
  onToggleSelect, 
  onStatusUpdate, 
  onClone, 
  onDelete, 
  onGenerateVariations,
  onWhyWhyAnalysis,
  getStatusColor, 
  formatDate 
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="result-item" style={{ 
      border: isSelected ? '2px solid #ff6b35' : '1px solid #e2e8f0',
      background: isSelected ? 'rgba(255, 107, 53, 0.05)' : 'white'
    }}>
      <div className="result-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            style={{ width: '16px', height: '16px' }}
          />
          <div>
            <h4 className="result-title">
              {proposition.proposition_data?.pujaName || 'Unnamed Puja'}
            </h4>
            <div className="result-meta">
              🕉️ {proposition.proposition_data?.deity} • 
              🎯 {proposition.proposition_data?.useCase} • 
              📅 {formatDate(proposition.created_at)}
              {proposition.performance_score && (
                <> • ⭐ {proposition.performance_score}/5</>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`status-badge ${getStatusColor(proposition.status)}`}>
            {proposition.status?.replace('_', ' ').toUpperCase()}
          </span>
          <button
            onClick={() => setShowActions(!showActions)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      
      <div className="result-content">
        <div style={{ marginBottom: '1rem' }}>
          <strong>Specificity:</strong>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginTop: '0.5rem' }}>
            {proposition.proposition_data?.specificity?.substring(0, 150)}...
          </p>
        </div>

        {showActions && (
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            flexWrap: 'wrap',
            padding: '1rem',
            background: 'rgba(248, 249, 250, 1)',
            borderRadius: '8px',
            marginTop: '1rem'
          }}>
            <button
              onClick={() => onStatusUpdate(proposition.id, 'approved')}
              style={{ ...actionButtonStyle, background: '#28a745' }}
            >
              Approve
            </button>
            <button
              onClick={() => onClone(proposition.id)}
              style={{ ...actionButtonStyle, background: '#17a2b8' }}
            >
              <Copy size={12} />
              Clone
            </button>
            <button
              onClick={() => onGenerateVariations(proposition.id)}
              style={{ ...actionButtonStyle, background: '#6c757d' }}
            >
              <RefreshCw size={12} />
              Variations
            </button>
            <button
              onClick={() => onWhyWhyAnalysis(proposition)}
              style={{ ...actionButtonStyle, background: '#ffc107', color: '#000' }}
            >
              <Lightbulb size={12} />
              Why-Why
            </button>
            <button
              onClick={() => onDelete(proposition.id)}
              style={{ ...actionButtonStyle, background: '#dc3545' }}
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================
// ANALYSIS RESULT CARD COMPONENT
// =====================================

const AnalysisResultCard = ({ title, icon, data, type }) => {
  const renderAnalysisContent = () => {
    switch (type) {
      case 'performance':
        return (
          <div>
            {data.analysis?.performanceInsights && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Top Performers:</strong>
                <div className="taglines">
                  {data.analysis.performanceInsights.topPerformers?.slice(0, 3).map((performer, index) => (
                    <span key={index} className="tagline-item">{performer}</span>
                  ))}
                </div>
              </div>
            )}
            {data.analysis?.dataAnalysis && (
              <div>
                <strong>Key Metrics:</strong>
                <p>Avg Rating: {data.analysis.dataAnalysis.avgRating}</p>
                <p>Total Revenue: ₹{data.analysis.dataAnalysis.totalRevenue?.toLocaleString()}</p>
              </div>
            )}
          </div>
        );
      
      case 'competitive':
        return (
          <div>
            {data.analysis?.competitiveAnalysis?.marketGaps && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Market Gaps:</strong>
                <ul style={{ marginLeft: '1rem' }}>
                  {data.analysis.competitiveAnalysis.marketGaps.slice(0, 3).map((gap, index) => (
                    <li key={index} style={{ fontSize: '0.9rem' }}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'whyWhy':
        return (
          <div>
            {data.analysis?.firstWhy && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>{data.analysis.firstWhy.question}</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {data.analysis.firstWhy.answer.substring(0, 120)}...
                </p>
              </div>
            )}
          </div>
        );
      
      case 'variations':
        return (
          <div>
            {data.variations && (
              <div>
                <strong>Generated Variations:</strong>
                <div className="taglines">
                  {data.variations.slice(0, 3).map((variation, index) => (
                    <span key={index} className="tagline-item">{variation.pujaName}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return <p>Analysis completed successfully</p>;
    }
  };

  return (
    <div className="result-item">
      <div className="result-header">
        <h4 className="result-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          {title}
        </h4>
      </div>
      <div className="result-content">
        {renderAnalysisContent()}
      </div>
    </div>
  );
};

// =====================================
// EXPERIMENT RESULT CARD COMPONENT
// =====================================

const ExperimentResultCard = ({ title, icon, data, type }) => {
  const renderExperimentContent = () => {
    switch (type) {
      case 'innovation':
        return (
          <div>
            {data.workshop?.innovationResults?.breakthroughIdeas && (
              <div>
                <strong>Breakthrough Ideas:</strong>
                <ul style={{ marginLeft: '1rem' }}>
                  {data.workshop.innovationResults.breakthroughIdeas.slice(0, 3).map((idea, index) => (
                    <li key={index} style={{ fontSize: '0.9rem' }}>{idea}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'abTest':
        return (
          <div>
            {data.testDesign?.hypothesis && (
              <div>
                <strong>Hypothesis:</strong>
                <p style={{ fontSize: '0.9rem' }}>{data.testDesign.hypothesis}</p>
              </div>
            )}
          </div>
        );
      
      case 'breakthrough':
        return (
          <div>
            {data.ideas?.breakthroughConcepts && (
              <div>
                <strong>Revolutionary Concepts:</strong>
                <div className="taglines">
                  {data.ideas.breakthroughConcepts.slice(0, 2).map((concept, index) => (
                    <span key={index} className="tagline-item">{concept.concept}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return <p>Experiment completed successfully</p>;
    }
  };

  return (
    <div className="result-item">
      <div className="result-header">
        <h4 className="result-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          {title}
        </h4>
      </div>
      <div className="result-content">
        {renderExperimentContent()}
      </div>
    </div>
  );
};

const actionButtonStyle = {
  background: '#007bff',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
};

export default AdvancedPropositionManager;