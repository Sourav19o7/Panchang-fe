// Enhanced PropositionGenerator Component
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Upload, 
  Sparkles, 
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Save,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import pujaService from '../../services/pujaService';
import pdfService from '../../services/pdfService';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import { DEITIES, USE_CASES, MONTHS } from '../../utils/constants';

const PropositionGenerator = () => {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useApp();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    month: selectedMonth,
    year: selectedYear,
    theme: '',
    focusDeity: '',
    targetAudience: '',
    specialEvents: [],
    customDates: [],
    useAI: true,
    generateCount: 10
  });
  const [pdfFiles, setPdfFiles] = useState([]);
  const [propositions, setPropositions] = useState([]);
  const [panchangData, setPanchangData] = useState(null);
  const [focusSuggestions, setFocusSuggestions] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedProposition, setSelectedProposition] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Load Panchang data when month/year changes
  useEffect(() => {
    if (formData.month && formData.year) {
      loadPanchangData();
    }
  }, [formData.month, formData.year]);

  // Update global state when form changes
  useEffect(() => {
    setSelectedMonth(formData.month);
    setSelectedYear(formData.year);
  }, [formData.month, formData.year, setSelectedMonth, setSelectedYear]);

  const loadPanchangData = async () => {
    try {
      setLoading(true);
      const result = await pujaService.generateMonthlyPanchang({
        month: formData.month,
        year: formData.year,
        location: 'delhi'
      });
      
      if (result.success) {
        setPanchangData(result.data);
      }
    } catch (error) {
      console.error('Failed to load Panchang data:', error);
      toast.error('Failed to load Panchang data');
    } finally {
      setLoading(false);
    }
  };

  const generateFocusSuggestions = async () => {
    try {
      setLoading(true);
      const result = await pujaService.generateFocusSuggestion({
        month: formData.month,
        year: formData.year,
        theme: formData.theme,
        pdfFiles: pdfFiles.map(f => f.filename)
      });

      if (result.success) {
        setFocusSuggestions(result.data.suggestions);
        toast.success('Focus suggestions generated successfully');
        setStep(2);
      }
    } catch (error) {
      console.error('Failed to generate focus suggestions:', error);
      toast.error('Failed to generate focus suggestions');
    } finally {
      setLoading(false);
    }
  };

  const generatePropositions = async () => {
    try {
      setLoading(true);
      
      // Get important dates from Panchang or use custom dates
      const importantDates = getImportantDates();
      
      const propositionResult = await pujaService.generatePropositions({
        month: formData.month,
        year: formData.year,
        focusTheme: formData.theme,
        dates: importantDates,
        pdfFiles: pdfFiles.map(f => f.filename),
        customParameters: {
          focusDeity: formData.focusDeity,
          targetAudience: formData.targetAudience,
          generateCount: formData.generateCount
        }
      });

      if (propositionResult.success) {
        setPropositions(propositionResult.data.propositions);
        toast.success(`Generated ${propositionResult.data.count} propositions successfully`);
        setStep(3);
      }
    } catch (error) {
      console.error('Failed to generate propositions:', error);
      toast.error('Failed to generate propositions');
    } finally {
      setLoading(false);
    }
  };

  const getImportantDates = () => {
    if (formData.customDates.length > 0) {
      return formData.customDates;
    }

    // Generate dates from Panchang data or create default important dates
    const daysInMonth = new Date(formData.year, formData.month, 0).getDate();
    const importantDates = [];
    
    // Add key dates (every 3-4 days for demonstration)
    for (let day = 1; day <= daysInMonth; day += 3) {
      const date = new Date(formData.year, formData.month - 1, day);
      importantDates.push({
        date: date.toISOString().split('T')[0],
        tithi: getTithiForDate(date),
        grahaTransit: 'Sample Transit',
        deity: formData.focusDeity || getRandomDeity(),
        useCase: getRandomUseCase()
      });
    }
    
    return importantDates.slice(0, formData.generateCount);
  };

  const getTithiForDate = (date) => {
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'];
    return tithis[date.getDate() % tithis.length];
  };

  const getRandomDeity = () => {
    return DEITIES[Math.floor(Math.random() * DEITIES.length)];
  };

  const getRandomUseCase = () => {
    return USE_CASES[Math.floor(Math.random() * USE_CASES.length)];
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (files) => {
    try {
      const validation = pdfService.validateFiles(files);
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        return;
      }

      setLoading(true);
      const result = await pdfService.uploadFiles(validation.validFiles);
      if (result.success) {
        setPdfFiles(prev => [...prev, ...result.data]);
        toast.success('PDFs uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload PDFs');
    } finally {
      setLoading(false);
    }
  };

  const exportPropositions = async () => {
    try {
      setLoading(true);
      const result = await pujaService.exportToSheets({
        month: formData.month,
        year: formData.year,
        propositionIds: propositions.map(p => p.id),
        spreadsheetTitle: `Puja Propositions - ${MONTHS[formData.month - 1]} ${formData.year}`
      });

      if (result.success) {
        toast.success('Propositions exported to Google Sheets successfully');
        window.open(result.data.spreadsheetUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to export propositions:', error);
      toast.error('Failed to export propositions');
    } finally {
      setLoading(false);
    }
  };

  const deleteProposition = (propositionId) => {
    setPropositions(prev => prev.filter(p => p.id !== propositionId));
    toast.success('Proposition deleted');
  };

  const editProposition = (proposition) => {
    setSelectedProposition(proposition);
    // Open edit modal or navigate to edit page
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const resetGenerator = () => {
    setStep(1);
    setPropositions([]);
    setFocusSuggestions(null);
    setPanchangData(null);
    setFormData({
      month: selectedMonth,
      year: selectedYear,
      theme: '',
      focusDeity: '',
      targetAudience: '',
      specialEvents: [],
      customDates: [],
      useAI: true,
      generateCount: 10
    });
  };

  if (loading && step === 1) {
    return <Loading message="Initializing proposition generator..." />;
  }

  return (
    <div className="proposition-generator">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Generate Puja Propositions</h1>
          <p className="page-subtitle">Create AI-powered puja propositions for your calendar</p>
        </div>
        <div className="header-actions">
          <button
            onClick={resetGenerator}
            className="btn btn-outline"
            disabled={loading}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className="progress-steps">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Setup</div>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Focus</div>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Generate</div>
          </div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="generator-content">
        {step === 1 && (
          <div className="setup-step">
            <div className="form-container">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="month" className="form-label required">
                      <Calendar size={16} />
                      Month
                    </label>
                    <select
                      id="month"
                      name="month"
                      value={formData.month}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      {MONTHS.map((month, index) => (
                        <option key={index + 1} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="year" className="form-label required">
                      Year
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <option key={2022 + i} value={2022 + i}>
                          {2022 + i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Theme & Focus</h3>
                <div className="form-group">
                  <label htmlFor="theme" className="form-label">
                    Theme (Optional)
                  </label>
                  <input
                    type="text"
                    id="theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Prosperity, Health, Spiritual Growth"
                  />
                  <small className="form-help">
                    Specify a theme to focus the AI generation on specific aspects
                  </small>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="focusDeity" className="form-label">
                      Focus Deity (Optional)
                    </label>
                    <select
                      id="focusDeity"
                      name="focusDeity"
                      value={formData.focusDeity}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Auto-select based on calendar</option>
                      {DEITIES.map(deity => (
                        <option key={deity} value={deity}>{deity}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="targetAudience" className="form-label">
                      Target Audience
                    </label>
                    <select
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">General Audience</option>
                      <option value="young_professionals">Young Professionals</option>
                      <option value="families">Families</option>
                      <option value="students">Students</option>
                      <option value="senior_citizens">Senior Citizens</option>
                      <option value="business_owners">Business Owners</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="form-section">
                <div className="section-header">
                  <h3>Advanced Options</h3>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="btn btn-outline btn-sm"
                  >
                    <Settings size={14} />
                    {showAdvancedOptions ? 'Hide' : 'Show'} Advanced
                  </button>
                </div>
                
                {showAdvancedOptions && (
                  <div className="advanced-options">
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="generateCount" className="form-label">
                          Number of Propositions
                        </label>
                        <select
                          id="generateCount"
                          name="generateCount"
                          value={formData.generateCount}
                          onChange={handleInputChange}
                          className="form-select"
                        >
                          <option value={5}>5 Propositions</option>
                          <option value={10}>10 Propositions</option>
                          <option value={15}>15 Propositions</option>
                          <option value={20}>20 Propositions</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="useAI"
                            checked={formData.useAI}
                            onChange={handleInputChange}
                            className="checkbox-input"
                          />
                          <span className="checkbox-custom"></span>
                          Use AI Enhancement
                        </label>
                        <small className="form-help">
                          Enable AI-powered content generation and optimization
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PDF Upload Section */}
              <div className="form-section">
                <h3>Reference Documents</h3>
                <div className="pdf-upload-area">
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                    className="file-input"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="upload-label">
                    <Upload size={24} />
                    <span>Upload PDF References</span>
                    <small>Click to upload or drag and drop PDFs (Max 5 files, 10MB each)</small>
                  </label>
                </div>
                
                {pdfFiles.length > 0 && (
                  <div className="uploaded-files">
                    <h4>Uploaded Files ({pdfFiles.length}):</h4>
                    <div className="files-list">
                      {pdfFiles.map((file, index) => (
                        <div key={index} className="file-item">
                          <div className="file-info">
                            <span className="file-name">{file.filename}</span>
                            <span className="file-size">{pdfService.formatFileSize(file.size)}</span>
                          </div>
                          <button
                            onClick={() => setPdfFiles(prev => prev.filter((_, i) => i !== index))}
                            className="remove-btn"
                            title="Remove file"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  onClick={generateFocusSuggestions}
                  disabled={loading || !formData.month || !formData.year}
                  className="btn btn-primary btn-lg"
                >
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Generating Focus...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate Focus Suggestions
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && focusSuggestions && (
          <div className="focus-step">
            <div className="step-header">
              <h2>AI-Generated Focus Suggestions</h2>
              <p>Review and customize the AI-recommended focus areas for {MONTHS[formData.month - 1]} {formData.year}</p>
            </div>

            <div className="focus-suggestions">
              <div className="suggestions-grid">
                <div className="suggestion-card">
                  <h3>Top Performing Categories</h3>
                  <div className="suggestion-content">
                    {focusSuggestions.topCategories?.map((category, index) => (
                      <div key={index} className="category-item">
                        <span className="category-name">{category.name}</span>
                        <span className="category-score">{category.score}% success</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="suggestion-card">
                  <h3>Recommended Deities</h3>
                  <div className="suggestion-content">
                    {focusSuggestions.recommendedDeities?.map((deity, index) => (
                      <div key={index} className="deity-item">
                        <span className="deity-name">{deity.name}</span>
                        <span className="deity-reason">{deity.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="suggestion-card">
                  <h3>Optimal Timing</h3>
                  <div className="suggestion-content">
                    {focusSuggestions.optimalTiming?.map((timing, index) => (
                      <div key={index} className="timing-item">
                        <span className="timing-date">{timing.date}</span>
                        <span className="timing-reason">{timing.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="suggestion-card">
                  <h3>Market Insights</h3>
                  <div className="suggestion-content">
                    <div className="insights-list">
                      {focusSuggestions.marketInsights?.map((insight, index) => (
                        <div key={index} className="insight-item">
                          <span className="insight-text">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button
                onClick={prevStep}
                className="btn btn-outline"
              >
                Back to Setup
              </button>
              <button
                onClick={generatePropositions}
                disabled={loading}
                className="btn btn-primary btn-lg"
              >
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Generating Propositions...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Propositions
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && propositions.length > 0 && (
          <div className="results-step">
            <div className="step-header">
              <h2>Generated Propositions ({propositions.length})</h2>
              <p>Review, edit, and export your AI-generated puja propositions</p>
            </div>

            <div className="results-actions">
              <div className="action-buttons">
                <button
                  onClick={exportPropositions}
                  disabled={loading || propositions.length === 0}
                  className="btn btn-primary"
                >
                  <Download size={16} />
                  Export to Sheets
                </button>
                <button
                  onClick={() => generatePropositions()}
                  disabled={loading}
                  className="btn btn-outline"
                >
                  <RefreshCw size={16} />
                  Regenerate
                </button>
              </div>
              
              <div className="filter-options">
                <select className="form-select">
                  <option value="">All Deities</option>
                  {DEITIES.map(deity => (
                    <option key={deity} value={deity}>{deity}</option>
                  ))}
                </select>
                <select className="form-select">
                  <option value="">All Use Cases</option>
                  {USE_CASES.map(useCase => (
                    <option key={useCase} value={useCase}>{useCase}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="propositions-grid">
              {propositions.map((proposition, index) => (
                <div key={proposition.id || index} className="proposition-card">
                  <div className="proposition-header">
                    <div className="proposition-title">
                      <h3>{proposition.pujaName || 'Unnamed Puja'}</h3>
                      <span className="proposition-id">#{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="proposition-actions">
                      <button
                        onClick={() => {
                          setSelectedProposition(proposition);
                          setShowPreview(true);
                        }}
                        className="action-btn"
                        title="Preview"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => editProposition(proposition)}
                        className="action-btn"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => deleteProposition(proposition.id)}
                        className="action-btn danger"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="proposition-content">
                    <div className="proposition-meta">
                      <div className="meta-item">
                        <Calendar size={12} />
                        <span>{proposition.date}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Deity:</span>
                        <span>{proposition.deity}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Use Case:</span>
                        <span>{proposition.useCase}</span>
                      </div>
                    </div>

                    <div className="proposition-description">
                      <p>{proposition.specificity?.substring(0, 120)}...</p>
                    </div>

                    {proposition.taglines && proposition.taglines.length > 0 && (
                      <div className="proposition-taglines">
                        {proposition.taglines.slice(0, 2).map((tagline, idx) => (
                          <span key={idx} className="tagline-chip">
                            {tagline}
                          </span>
                        ))}
                        {proposition.taglines.length > 2 && (
                          <span className="tagline-more">
                            +{proposition.taglines.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="proposition-footer">
                      <div className="quality-score">
                        <span className="score-label">AI Score:</span>
                        <span className="score-value">{proposition.aiScore || '4.2'}/5.0</span>
                      </div>
                      <div className="complexity-indicator">
                        <span className={`complexity ${proposition.complexity || 'medium'}`}>
                          {(proposition.complexity || 'medium').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="step-actions">
              <button
                onClick={prevStep}
                className="btn btn-outline"
              >
                Back to Focus
              </button>
              <button
                onClick={resetGenerator}
                className="btn btn-outline"
              >
                Start New Generation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedProposition && (
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Proposition Preview"
          size="large"
        >
          <div className="proposition-preview">
            <div className="preview-header">
              <h2>{selectedProposition.pujaName}</h2>
              <div className="preview-meta">
                <span>Date: {selectedProposition.date}</span>
                <span>Deity: {selectedProposition.deity}</span>
                <span>Use Case: {selectedProposition.useCase}</span>
              </div>
            </div>

            <div className="preview-content">
              <div className="content-section">
                <h3>Specificity</h3>
                <p>{selectedProposition.specificity}</p>
              </div>

              <div className="content-section">
                <h3>Rationale</h3>
                <p>{selectedProposition.rationale}</p>
              </div>

              {selectedProposition.whyWhyAnalysis && (
                <div className="content-section">
                  <h3>Why-Why Analysis</h3>
                  <div className="why-analysis">
                    {Object.entries(selectedProposition.whyWhyAnalysis).map(([key, value]) => (
                      <div key={key} className="analysis-item">
                        <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                        <p>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="content-section">
                <h3>Marketing Taglines</h3>
                <div className="taglines-list">
                  {selectedProposition.taglines?.map((tagline, index) => (
                    <div key={index} className="tagline-item">
                      <span className="tagline-number">{index + 1}.</span>
                      <span className="tagline-text">{tagline}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="preview-actions">
              <button
                onClick={() => editProposition(selectedProposition)}
                className="btn btn-primary"
              >
                <Edit size={16} />
                Edit Proposition
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="btn btn-outline"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Loading Overlay */}
      {loading && step > 1 && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-message">
              {step === 2 ? 'Generating focus suggestions...' : 'Creating puja propositions...'}
            </p>
            <small>This may take a few moments</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropositionGenerator;