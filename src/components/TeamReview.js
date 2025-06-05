// src/components/TeamReview.js
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit3, 
  Eye,
  Download,
  Upload,
  Users,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

const TeamReview = () => {
  const [loading, setLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState(null);
  const [propositions, setPropositions] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [selectedPropositions, setSelectedPropositions] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [bulkNotes, setBulkNotes] = useState('');
  const [filter, setFilter] = useState({
    status: 'all',
    month: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    loadReviewData();
    loadPendingReviews();
  }, [filter]);

  const loadReviewData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/team-review/status', { 
        params: filter.status !== 'all' ? filter : { month: filter.month, year: filter.year }
      });
      
      if (response.data.success) {
        setReviewStats(response.data.data.stats);
        setPropositions(response.data.data.propositions);
      }
    } catch (error) {
      console.error('Error loading review data:', error);
      toast.error('Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  const loadPendingReviews = async () => {
    try {
      const response = await api.get('/team-review/pending', {
        params: { limit: 10 }
      });
      
      if (response.data.success) {
        setPendingReviews(response.data.data);
      }
    } catch (error) {
      console.error('Error loading pending reviews:', error);
    }
  };

  const handleReviewSubmit = async (propositionId, status, notes = '', performanceScore = null) => {
    try {
      const response = await api.post(`/team-review/submit/${propositionId}`, {
        status,
        notes,
        performance_score: performanceScore
      });
      
      if (response.data.success) {
        toast.success('Review submitted successfully');
        loadReviewData();
        loadPendingReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const handleBulkReview = async () => {
    if (!bulkAction || selectedPropositions.size === 0) {
      toast.error('Please select propositions and action');
      return;
    }

    try {
      const response = await api.post('/team-review/bulk-review', {
        propositionIds: Array.from(selectedPropositions),
        status: bulkAction,
        notes: bulkNotes
      });
      
      if (response.data.success) {
        toast.success(`Bulk review completed for ${selectedPropositions.size} propositions`);
        setSelectedPropositions(new Set());
        setBulkAction('');
        setBulkNotes('');
        loadReviewData();
        loadPendingReviews();
      }
    } catch (error) {
      console.error('Error with bulk review:', error);
      toast.error('Failed to complete bulk review');
    }
  };

  const handleSyncSheetFeedback = async () => {
    const spreadsheetId = prompt('Enter Google Sheets ID to sync feedback from:');
    if (!spreadsheetId) return;

    try {
      setLoading(true);
      const response = await api.post('/team-review/sync-sheet-feedback', {
        spreadsheetId
      });
      
      if (response.data.success) {
        toast.success(`Synced feedback for ${response.data.data.updatedCount} propositions`);
        loadReviewData();
      }
    } catch (error) {
      console.error('Error syncing sheet feedback:', error);
      toast.error('Failed to sync sheet feedback');
    } finally {
      setLoading(false);
    }
  };

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
    if (selectedPropositions.size === propositions.length) {
      setSelectedPropositions(new Set());
    } else {
      setSelectedPropositions(new Set(propositions.map(p => p.id)));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={18} className="text-red-500" />;
      case 'needs_revision':
        return <Edit3 size={18} className="text-yellow-500" />;
      default:
        return <Clock size={18} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs_revision': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Header with Stats */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">
            <Users size={24} />
          </div>
          <div>
            <h2 className="card-title">Team Review Dashboard</h2>
            <p className="card-description">
              Manage proposition reviews and team collaboration workflow.
            </p>
          </div>
        </div>

        {/* Review Statistics */}
        {reviewStats && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 193, 7, 0.1)', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ffc107' }}>
                {reviewStats.pending}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Pending Review</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(40, 167, 69, 0.1)', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#28a745' }}>
                {reviewStats.approved}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Approved</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(220, 53, 69, 0.1)', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#dc3545' }}>
                {reviewStats.rejected}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Rejected</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 107, 53, 0.1)', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ff6b35' }}>
                {reviewStats.needsRevision}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Needs Revision</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button
            onClick={handleSyncSheetFeedback}
            disabled={loading}
            className="btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} />
            Sync Sheet Feedback
          </button>
          
          <button
            onClick={() => window.open('https://docs.google.com/spreadsheets/', '_blank')}
            className="btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Eye size={16} />
            View Sheets
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="form-input"
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Status</option>
            <option value="pending_review">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="needs_revision">Needs Revision</option>
          </select>

          <select
            value={filter.month}
            onChange={(e) => setFilter({ ...filter, month: e.target.value })}
            className="form-input"
            style={{ minWidth: '120px' }}
          >
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('en', { month: 'long' })}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={filter.year}
            onChange={(e) => setFilter({ ...filter, year: parseInt(e.target.value) })}
            className="form-input"
            style={{ minWidth: '100px' }}
            min="2020"
            max="2030"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPropositions.size > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '600' }}>
              {selectedPropositions.size} selected
            </span>
            
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="form-input"
              style={{ minWidth: '150px' }}
            >
              <option value="">Select Action</option>
              <option value="approved">Approve All</option>
              <option value="rejected">Reject All</option>
              <option value="needs_revision">Mark for Revision</option>
            </select>

            <input
              type="text"
              value={bulkNotes}
              onChange={(e) => setBulkNotes(e.target.value)}
              placeholder="Bulk review notes"
              className="form-input"
              style={{ flex: 1, minWidth: '200px' }}
            />

            <button
              onClick={handleBulkReview}
              disabled={!bulkAction}
              className="btn btn-primary"
            >
              Apply Bulk Action
            </button>
          </div>
        </div>
      )}

      {/* Propositions List */}
      <div className="results-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#333', fontSize: '1.4rem', fontWeight: '700' }}>
            Propositions for Review ({propositions.length})
          </h3>
          <button
            onClick={selectAll}
            className="btn"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            {selectedPropositions.size === propositions.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p>Loading propositions...</p>
          </div>
        ) : propositions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No propositions found for the selected filters.
          </div>
        ) : (
          <div className="results-grid">
            {propositions.map((proposition) => (
              <PropositionReviewCard
                key={proposition.id}
                proposition={proposition}
                isSelected={selectedPropositions.has(proposition.id)}
                onToggleSelect={() => togglePropositionSelection(proposition.id)}
                onReviewSubmit={handleReviewSubmit}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pending Reviews Quick Panel */}
      {pendingReviews.length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <div className="card-icon">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Quick Review Panel</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                {pendingReviews.length} propositions awaiting review
              </p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pendingReviews.slice(0, 3).map((prop) => (
              <div key={prop.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255, 193, 7, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 193, 7, 0.2)'
              }}>
                <div>
                  <div style={{ fontWeight: '600' }}>
                    {prop.proposition_data?.pujaName || 'Unnamed Puja'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    {prop.proposition_data?.deity} • {formatDate(prop.created_at)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleReviewSubmit(prop.id, 'approved')}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReviewSubmit(prop.id, 'needs_revision')}
                    style={{
                      background: '#ffc107',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    📝 Revise
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Individual Proposition Review Card Component
const PropositionReviewCard = ({ 
  proposition, 
  isSelected, 
  onToggleSelect, 
  onReviewSubmit,
  getStatusIcon,
  getStatusColor,
  formatDate 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [performanceScore, setPerformanceScore] = useState('');

  const handleQuickReview = (status) => {
    onReviewSubmit(proposition.id, status, reviewNotes, parseFloat(performanceScore) || null);
    setReviewNotes('');
    setPerformanceScore('');
  };

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
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getStatusIcon(proposition.status)}
          <span className={`status-badge ${getStatusColor(proposition.status).replace('bg-', 'status-').replace('text-', '').split(' ')[0]}`}>
            {proposition.status?.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="result-content">
        <div style={{ marginBottom: '1rem' }}>
          <strong>Specificity:</strong>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginTop: '0.5rem' }}>
            {proposition.proposition_data?.specificity?.substring(0, 150)}...
          </p>
        </div>

        {proposition.team_notes && (
          <div style={{ 
            marginBottom: '1rem',
            padding: '0.75rem',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '6px'
          }}>
            <strong>Team Notes:</strong>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{proposition.team_notes}</p>
          </div>
        )}

        {proposition.status === 'pending_review' && (
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff6b35',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}
            >
              {showDetails ? '− Hide Review Form' : '+ Show Review Form'}
            </button>

            {showDetails && (
              <div style={{ 
                padding: '1rem',
                background: 'rgba(248, 249, 250, 1)',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add your review comments..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                    Performance Score (1-5)
                  </label>
                  <input
                    type="number"
                    value={performanceScore}
                    onChange={(e) => setPerformanceScore(e.target.value)}
                    placeholder="Optional score"
                    min="1"
                    max="5"
                    step="0.1"
                    style={{
                      width: '100px',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleQuickReview('approved')}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>
                  
                  <button
                    onClick={() => handleQuickReview('needs_revision')}
                    style={{
                      background: '#ffc107',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Edit3 size={14} />
                    Needs Revision
                  </button>
                  
                  <button
                    onClick={() => handleQuickReview('rejected')}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamReview;