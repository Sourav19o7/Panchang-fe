

// ==================================================
// 15. src/components/puja/PujaCard.js
// ==================================================
import React from 'react';
import { Calendar, Star, Eye, Edit, Download, MoreHorizontal } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';

const PujaCard = ({ 
  puja, 
  onView, 
  onEdit, 
  onExport, 
  onDelete,
  showActions = true 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending_review': return 'warning';
      case 'in_progress': return 'info';
      default: return 'gray';
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="puja-card">
      <div className="puja-card-header">
        <div className="puja-title-section">
          <h3 className="puja-title">
            {puja.proposition_data?.pujaName || 'Unnamed Puja'}
          </h3>
          <span className={`status-badge status-${getStatusColor(puja.status)}`}>
            {formatStatus(puja.status)}
          </span>
        </div>
        
        {showActions && (
          <div className="puja-actions">
            <button
              onClick={() => onView?.(puja)}
              className="action-btn"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            
            <button
              onClick={() => onEdit?.(puja)}
              className="action-btn"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            
            <button
              onClick={() => onExport?.(puja)}
              className="action-btn"
              title="Export"
            >
              <Download size={16} />
            </button>
            
            <div className="dropdown">
              <button className="action-btn dropdown-trigger">
                <MoreHorizontal size={16} />
              </button>
              <div className="dropdown-menu">
                <button onClick={() => onDelete?.(puja)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="puja-content">
        <div className="puja-details">
          <div className="detail-row">
            <Calendar size={14} />
            <span>{formatDate(puja.date)}</span>
          </div>
          
          {puja.proposition_data?.deity && (
            <div className="detail-row">
              <span className="detail-label">Deity:</span>
              <span>{puja.proposition_data.deity}</span>
            </div>
          )}
          
          {puja.proposition_data?.useCase && (
            <div className="detail-row">
              <span className="detail-label">Use Case:</span>
              <span>{puja.proposition_data.useCase}</span>
            </div>
          )}
          
          {puja.performance_score && (
            <div className="detail-row">
              <Star size={14} />
              <span>{puja.performance_score}/5.0</span>
            </div>
          )}
        </div>

        {puja.proposition_data?.rationale && (
          <div className="puja-rationale">
            <p>{puja.proposition_data.rationale.substring(0, 150)}...</p>
          </div>
        )}

        {puja.proposition_data?.taglines && puja.proposition_data.taglines.length > 0 && (
          <div className="puja-taglines">
            {puja.proposition_data.taglines.slice(0, 2).map((tagline, index) => (
              <span key={index} className="tagline-chip">
                {tagline}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="puja-card-footer">
        <div className="puja-meta">
          <span className="created-date">
            Created {formatDate(puja.created_at)}
          </span>
          
          {puja.approved_by && (
            <span className="approved-by">
              Approved by {puja.approved_by}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PujaCard;