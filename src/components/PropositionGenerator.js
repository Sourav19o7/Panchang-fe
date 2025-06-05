import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Sparkles, FileText, Download, Plus, Trash2, Upload, Calendar, RefreshCw } from 'lucide-react';

const PropositionGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [experimentLoading, setExperimentLoading] = useState(false);
  const [panchangLoading, setPanchangLoading] = useState(false);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    focusTheme: ''
  });
  const [dates, setDates] = useState([
    {
      date: '',
      tithi: '',
      grahaTransit: '',
      deity: 'Ganesha',
      useCase: 'Health & Wellness'
    }
  ]);
  const [propositions, setPropositions] = useState(null);
  const [experimentalPujas, setExperimentalPujas] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [availablePDFs, setAvailablePDFs] = useState([]);
  const [panchangData, setPanchangData] = useState(null);

  const deities = [
    'Ganesha', 'Shiva', 'Vishnu', 'Durga', 'Lakshmi', 'Saraswati', 
    'Krishna', 'Rama', 'Hanuman', 'Kali', 'Parvati', 'Brahma',
    'Surya', 'Chandra', 'Mangal', 'Budh', 'Guru', 'Shukra', 'Shani',
    'Rahu', 'Ketu'
  ];

  const useCases = [
    'Health & Wellness', 'Career Growth', 'Relationship Harmony', 
    'Financial Prosperity', 'Education Success', 'Spiritual Progress',
    'Protection from Negativity', 'Mental Peace', 'Family Happiness',
    'Business Success', 'Marriage & Love', 'Children Welfare',
    'Travel Safety', 'Property & Home', 'Debt Relief', 
    'Victory & Success', 'Knowledge & Wisdom', 'Divine Blessings'
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const tithis = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi',
    'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
    'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'
  ];

  // Load available PDFs on component mount
  useEffect(() => {
    loadAvailablePDFs();
  }, []);

  const loadAvailablePDFs = async () => {
    try {
      const response = await api.listPDFs();
      if (response.data.success) {
        setAvailablePDFs(response.data.data);
      }
    } catch (error) {
      console.error('Error loading PDFs:', error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (index, field, value) => {
    const newDates = [...dates];
    newDates[index][field] = value;
    setDates(newDates);
  };

  const addDate = () => {
    setDates([...dates, {
      date: '',
      tithi: '',
      grahaTransit: '',
      deity: 'Ganesha',
      useCase: 'Health & Wellness'
    }]);
  };

  const removeDate = (index) => {
    if (dates.length > 1) {
      setDates(dates.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types
    const invalidFiles = files.filter(file => file.type !== 'application/pdf');
    if (invalidFiles.length > 0) {
      toast.error('Only PDF files are allowed');
      return;
    }

    // Validate file sizes (10MB limit)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('pdfs', file);
      });

      const response = await api.uploadPDFs(formData);
      if (response.data.success) {
        setUploadedFiles([...uploadedFiles, ...response.data.data]);
        await loadAvailablePDFs(); // Refresh the list
        toast.success(`Uploaded ${files.length} PDF file(s) successfully!`);
      } else {
        toast.error('Failed to upload PDF files');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload PDF files');
    }
  };

  const loadPanchangForMonth = async () => {
    setPanchangLoading(true);
    try {
      const response = await api.generateMonthlyPanchang({
        month: formData.month,
        year: formData.year,
        location: 'delhi'
      });
      
      if (response.data.success) {
        setPanchangData(response.data.data);
        toast.success('Panchang data loaded successfully!');
      } else {
        toast.error('Failed to load Panchang data');
      }
    } catch (error) {
      console.error('Error loading Panchang:', error);
      toast.error('Failed to load Panchang data');
    } finally {
      setPanchangLoading(false);
    }
  };

  const fillPanchangData = (index, panchangDay) => {
    if (!panchangDay) return;
    
    const newDates = [...dates];
    newDates[index] = {
      ...newDates[index],
      tithi: panchangDay.tithi || '',
      grahaTransit: panchangDay.grahaTransits?.length > 0 
        ? `${panchangDay.grahaTransits[0].planet} in ${panchangDay.grahaTransits[0].sign}` 
        : ''
    };
    setDates(newDates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    const validDates = dates.filter(d => d.date);
    if (validDates.length === 0) {
      toast.error('Please add at least one date');
      return;
    }

    setLoading(true);

    try {
      const response = await api.generatePropositions({
        ...formData,
        dates: validDates,
        pdfFiles: uploadedFiles.map(file => file.filename || file.name),
        customParameters: {
          includeWhyWhyAnalysis: true,
          generateTaglines: true,
          detailedRationale: true
        }
      });
      
      if (response.data.success) {
        setPropositions(response.data.data);
        toast.success(`Generated ${response.data.data.count} puja propositions!`);
      } else {
        toast.error(response.data.error || 'Failed to generate propositions');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to generate propositions');
      } else if (error.response?.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
      } else {
        toast.error('Failed to generate propositions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateExperimental = async () => {
    setExperimentLoading(true);

    try {
      const response = await api.generateExperimentalPujas({
        month: formData.month,
        year: formData.year,
        pdfFiles: uploadedFiles.map(file => file.filename || file.name),
        experimentParameters: {
          riskTolerance: 'medium',
          innovationLevel: 'high',
          marketTrends: true
        }
      });
      
      if (response.data.success) {
        setExperimentalPujas(response.data.data);
        toast.success('Generated experimental puja concepts!');
      } else {
        toast.error(response.data.error || 'Failed to generate experimental pujas');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate experimental pujas');
    } finally {
      setExperimentLoading(false);
    }
  };

  const handleExport = async () => {
    if (!propositions || !propositions.propositions) {
      toast.error('No propositions to export');
      return;
    }

    setExportLoading(true);

    try {
      const response = await api.exportToSheets({
        month: formData.month,
        year: formData.year,
        propositionIds: propositions.savedIds || [],
        spreadsheetTitle: `Puja Propositions - ${months[formData.month - 1]} ${formData.year}`,
        includeExperiments: !!experimentalPujas
      });
      
      if (response.data.success) {
        toast.success('Propositions exported to Google Sheets!');
        if (response.data.data.spreadsheetUrl && response.data.data.spreadsheetUrl !== 'mock_url') {
          window.open(response.data.data.spreadsheetUrl, '_blank');
        }
      } else {
        toast.error(response.data.error || 'Failed to export to sheets');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to export to sheets');
    } finally {
      setExportLoading(false);
    }
  };

  const getPanchangDayForDate = (selectedDate) => {
    if (!panchangData?.data || !selectedDate) return null;
    
    return panchangData.data.find(day => {
      const dayDate = new Date(day.date).toISOString().split('T')[0];
      return dayDate === selectedDate;
    });
  };

  return (
    <div>
      {/* Main Form */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="card-title">Puja Proposition Generator</h2>
            <p className="card-description">
              Generate detailed puja propositions with AI-powered rationale, timing, and content for specific dates.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Month</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleFormChange}
                className="form-input"
                required
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleFormChange}
                className="form-input"
                min="2020"
                max="2030"
                required
              />
            </div>

            <div className="form-group">
              <button
                type="button"
                onClick={loadPanchangForMonth}
                className="btn"
                disabled={panchangLoading}
                style={{ marginTop: '1.5rem' }}
              >
                {panchangLoading ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Load Panchang
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Focus Theme (Optional)</label>
            <input
              type="text"
              name="focusTheme"
              value={formData.focusTheme}
              onChange={handleFormChange}
              className="form-input"
              placeholder="e.g., Festival season, Prosperity focus, Health & wellness month"
            />
          </div>

          {/* PDF Upload Section */}
          <div className="form-group">
            <label className="form-label">
              <Upload size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Reference PDFs (Optional)
            </label>
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileUpload}
              className="form-input"
              style={{ padding: '12px' }}
            />
            
            {/* Available PDFs */}
            {availablePDFs.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <small style={{ color: '#666' }}>Available PDFs in system:</small>
                <div className="taglines">
                  {availablePDFs.map((file, index) => (
                    <span key={index} className="tagline-item" style={{ fontSize: '0.8rem' }}>
                      📄 {file.filename}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <small style={{ color: '#28a745' }}>Recently uploaded:</small>
                <div className="taglines">
                  {uploadedFiles.map((file, index) => (
                    <span key={index} className="tagline-item" style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#28a745' }}>
                      📄 {file.filename || file.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panchang Summary */}
          {panchangData && (
            <div style={{ 
              background: 'rgba(102, 126, 234, 0.1)', 
              padding: '1rem', 
              borderRadius: '10px', 
              marginBottom: '1rem' 
            }}>
              <h4 style={{ color: '#667eea', margin: '0 0 0.5rem 0' }}>
                📅 Panchang Data Loaded
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                {panchangData.data?.length || 0} days of data available for {months[formData.month - 1]} {formData.year}
              </p>
            </div>
          )}

          {/* Dates Configuration */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label className="form-label" style={{ margin: 0 }}>
                <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Puja Dates & Details
              </label>
              <button
                type="button"
                onClick={addDate}
                className="btn"
                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              >
                <Plus size={16} />
                Add Date
              </button>
            </div>

            {dates.map((dateItem, index) => {
              const panchangDay = getPanchangDayForDate(dateItem.date);
              
              return (
                <div key={index} style={{ 
                  background: 'rgba(255, 255, 255, 0.8)', 
                  padding: '1.5rem', 
                  borderRadius: '15px', 
                  marginBottom: '1rem',
                  border: '1px solid #e2e8f0',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ color: '#333', margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                      Puja Configuration {index + 1}
                    </h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {panchangDay && (
                        <button
                          type="button"
                          onClick={() => fillPanchangData(index, panchangDay)}
                          style={{ 
                            background: 'rgba(255, 107, 53, 0.1)', 
                            border: '1px solid rgba(255, 107, 53, 0.3)', 
                            color: '#ff6b35', 
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Use Panchang Data
                        </button>
                      )}
                      {dates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDate(index)}
                          style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Panchang Info */}
                  {panchangDay && (
                    <div style={{ 
                      background: 'rgba(255, 107, 53, 0.05)', 
                      padding: '0.75rem', 
                      borderRadius: '8px', 
                      marginBottom: '1rem',
                      fontSize: '0.85rem'
                    }}>
                      <strong>Available Panchang Data:</strong> {panchangDay.tithi}
                      {panchangDay.nakshatra && ` • ${panchangDay.nakshatra}`}
                      {panchangDay.festivals?.length > 0 && ` • ${panchangDay.festivals.join(', ')}`}
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date *</label>
                      <input
                        type="date"
                        value={dateItem.date}
                        onChange={(e) => handleDateChange(index, 'date', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tithi</label>
                      <select
                        value={dateItem.tithi}
                        onChange={(e) => handleDateChange(index, 'tithi', e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select Tithi</option>
                        {tithis.map((tithi) => (
                          <option key={tithi} value={tithi}>{tithi}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Graha Transit</label>
                      <input
                        type="text"
                        value={dateItem.grahaTransit}
                        onChange={(e) => handleDateChange(index, 'grahaTransit', e.target.value)}
                        className="form-input"
                        placeholder="e.g., Jupiter in Taurus"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Deity *</label>
                      <select
                        value={dateItem.deity}
                        onChange={(e) => handleDateChange(index, 'deity', e.target.value)}
                        className="form-input"
                        required
                      >
                        {deities.map((deity) => (
                          <option key={deity} value={deity}>{deity}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Use Case *</label>
                      <select
                        value={dateItem.useCase}
                        onChange={(e) => handleDateChange(index, 'useCase', e.target.value)}
                        className="form-input"
                        required
                      >
                        {useCases.map((useCase) => (
                          <option key={useCase} value={useCase}>{useCase}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', marginRight: '8px' }}></div>
                Generating Propositions...
              </>
            ) : (
              <>
                <FileText size={18} />
                Generate Puja Propositions
              </>
            )}
          </button>

          {/* Experimental Pujas Button */}
          <button 
            type="button"
            onClick={handleGenerateExperimental}
            className="btn"
            disabled={experimentLoading}
            style={{ width: '100%' }}
          >
            {experimentLoading ? (
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', marginRight: '8px' }}></div>
                Generating Experiments...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate 3 Experimental Pujas
              </>
            )}
          </button>
        </form>
      </div>

      {/* Experimental Pujas Results */}
      {experimentalPujas && (
        <div className="results-section">
          <h3 style={{ color: '#333', fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            🧪 Experimental Puja Concepts
          </h3>

          <div className="results-grid">
            {experimentalPujas.experiments?.map((experiment, index) => (
              <div key={index} className="result-item" style={{ borderLeft: '4px solid #667eea' }}>
                <div className="result-header">
                  <div>
                    <h4 className="result-title">{experiment.name}</h4>
                    <div className="result-meta">
                      Type: {experiment.type?.replace('_', ' ').toUpperCase()} • 
                      Risk: {experiment.riskLevel?.toUpperCase()}
                    </div>
                  </div>
                  <span className="status-badge" style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}>
                    EXPERIMENTAL
                  </span>
                </div>
                
                <div className="result-content">
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Description:</strong>
                    <p>{experiment.description}</p>
                  </div>
                  
                  <div>
                    <strong>Expected Outcome:</strong>
                    <p>{experiment.expectedOutcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Propositions Results */}
      {propositions && (
        <div className="results-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#333', fontSize: '1.4rem', fontWeight: '700' }}>
              📿 Generated Propositions ({propositions.count})
            </h3>
            <button 
              onClick={handleExport}
              className="btn btn-primary"
              disabled={exportLoading}
            >
              {exportLoading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Export to Sheets
                </>
              )}
            </button>
          </div>

          <div className="results-grid">
            {propositions.propositions?.map((proposition, index) => (
              <div key={index} className="result-item">
                <div className="result-header">
                  <div>
                    <h4 className="result-title">{proposition.pujaName}</h4>
                    <div className="result-meta">
                      🕉️ {proposition.deity} • 🎯 {proposition.useCase} • 📅 {proposition.date}
                      {proposition.tithi && ` • 🌙 ${proposition.tithi}`}
                    </div>
                  </div>
                  <span className="status-badge status-pending">Pending Review</span>
                </div>
                
                <div className="result-content">
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Specificity:</strong>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{proposition.specificity}</p>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>AI-Generated Rationale:</strong>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#555' }}>
                      {proposition.rationale?.length > 300 
                        ? `${proposition.rationale.substring(0, 300)}...` 
                        : proposition.rationale
                      }
                    </p>
                  </div>
                  
                  {proposition.taglines && proposition.taglines.length > 0 && (
                    <div>
                      <strong>Suggested Taglines:</strong>
                      <div className="taglines">
                        {proposition.taglines.map((tagline, tIndex) => (
                          <span key={tIndex} className="tagline-item">{tagline}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {proposition.grahaTransit && (
                    <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(255, 107, 53, 0.05)', borderRadius: '6px' }}>
                      <strong>Astrological Context:</strong> {proposition.grahaTransit}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {propositions.savedIds && propositions.savedIds.length > 0 && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '2rem', 
              padding: '1rem',
              background: 'rgba(40, 167, 69, 0.1)',
              borderRadius: '10px',
              color: '#28a745'
            }}>
              ✅ Successfully saved {propositions.savedIds.length} propositions to database
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropositionGenerator;