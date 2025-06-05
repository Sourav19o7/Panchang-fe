

// ==================================================
// 16. src/components/puja/PujaForm.js
// ==================================================
import React, { useState } from 'react';
import { Save, X, Calendar, User, Target } from 'lucide-react';
import { toast } from 'react-toastify';
import { DEITIES, USE_CASES } from '../../utils/constants';

const PujaForm = ({ 
  puja = null, 
  onSave, 
  onCancel, 
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    pujaName: puja?.proposition_data?.pujaName || '',
    deity: puja?.proposition_data?.deity || '',
    useCase: puja?.proposition_data?.useCase || '',
    date: puja?.date || '',
    specificity: puja?.proposition_data?.specificity || '',
    rationale: puja?.proposition_data?.rationale || '',
    taglines: puja?.proposition_data?.taglines?.join(', ') || '',
    notes: puja?.team_notes || ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pujaName.trim()) {
      newErrors.pujaName = 'Puja name is required';
    }

    if (!formData.deity) {
      newErrors.deity = 'Please select a deity';
    }

    if (!formData.useCase) {
      newErrors.useCase = 'Please select a use case';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.rationale.trim() || formData.rationale.length < 100) {
      newErrors.rationale = 'Rationale must be at least 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    try {
      setSaving(true);

      const pujaData = {
        proposition_data: {
          pujaName: formData.pujaName,
          deity: formData.deity,
          useCase: formData.useCase,
          specificity: formData.specificity,
          rationale: formData.rationale,
          taglines: formData.taglines.split(',').map(t => t.trim()).filter(t => t)
        },
        date: formData.date,
        team_notes: formData.notes
      };

      await onSave(pujaData);
      toast.success(`Puja ${mode === 'create' ? 'created' : 'updated'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${mode} puja`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="puja-form">
      <div className="form-header">
        <h2>{mode === 'create' ? 'Create New Puja' : 'Edit Puja'}</h2>
        <button onClick={onCancel} className="close-btn">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="pujaName" className="form-label required">
              <Target size={16} />
              Puja Name
            </label>
            <input
              type="text"
              id="pujaName"
              name="pujaName"
              value={formData.pujaName}
              onChange={handleInputChange}
              className={`form-input ${errors.pujaName ? 'error' : ''}`}
              placeholder="Enter puja name"
              maxLength={200}
            />
            {errors.pujaName && (
              <span className="form-error">{errors.pujaName}</span>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="deity" className="form-label required">
                <User size={16} />
                Deity
              </label>
              <select
                id="deity"
                name="deity"
                value={formData.deity}
                onChange={handleInputChange}
                className={`form-select ${errors.deity ? 'error' : ''}`}
              >
                <option value="">Select deity</option>
                {DEITIES.map(deity => (
                  <option key={deity} value={deity}>{deity}</option>
                ))}
              </select>
              {errors.deity && (
                <span className="form-error">{errors.deity}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="useCase" className="form-label required">
                Use Case
              </label>
              <select
                id="useCase"
                name="useCase"
                value={formData.useCase}
                onChange={handleInputChange}
                className={`form-select ${errors.useCase ? 'error' : ''}`}
              >
                <option value="">Select use case</option>
                {USE_CASES.map(useCase => (
                  <option key={useCase} value={useCase}>{useCase}</option>
                ))}
              </select>
              {errors.useCase && (
                <span className="form-error">{errors.useCase}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label required">
              <Calendar size={16} />
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`form-input ${errors.date ? 'error' : ''}`}
            />
            {errors.date && (
              <span className="form-error">{errors.date}</span>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Details</h3>
          
          <div className="form-group">
            <label htmlFor="specificity" className="form-label">
              Specificity
            </label>
            <textarea
              id="specificity"
              name="specificity"
              value={formData.specificity}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
              placeholder="Specific rituals, offerings, and procedures..."
              maxLength={500}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rationale" className="form-label required">
              Rationale
            </label>
            <textarea
              id="rationale"
              name="rationale"
              value={formData.rationale}
              onChange={handleInputChange}
              className={`form-textarea ${errors.rationale ? 'error' : ''}`}
              rows="6"
              placeholder="Detailed explanation (minimum 100 characters)..."
              maxLength={1000}
            />
            <div className="char-count">
              {formData.rationale.length}/1000 characters
            </div>
            {errors.rationale && (
              <span className="form-error">{errors.rationale}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="taglines" className="form-label">
              Taglines
            </label>
            <input
              type="text"
              id="taglines"
              name="taglines"
              value={formData.taglines}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Comma-separated taglines..."
            />
            <small className="form-help">
              Separate multiple taglines with commas
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Team Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
              placeholder="Internal notes and comments..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
            disabled={saving}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="btn-spinner"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {mode === 'create' ? 'Create Puja' : 'Update Puja'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PujaForm;