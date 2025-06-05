import React, { useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Sparkles, FileText, Download, Plus, Trash2, Upload, Calendar } from 'lucide-react';

const PropositionGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [experimentLoading, setExperimentLoading] = useState(false);
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
        toast.success(`Uploaded ${files.length} PDF file(s) successfully!`);
      } else {
        toast.error('Failed to upload PDF files');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload PDF files');
    }
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
        pdfFiles: uploadedFiles.map(file => file.filename)
      });
      
      if (response.data.success) {
        setPropositions(response.data.data);
        toast.success(`Generated ${response.data.data.count} puja propositions!`);
      } else {
        toast.error(response.data.error || 'Failed to generate propositions');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate propositions');
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
        pdfFiles: uploadedFiles.map(file => file.filename)
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
        spreadsheetTitle: `Puja Propositions - ${months[formData.month - 1]} ${formData.year}`
      });
      
      if (response.data.success) {
        toast.success('Propositions exported to Google Sheets!');
        if (response.data.data.spreadsheetUrl) {
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

  const getRandomTithi = () => {
    return tithis[Math.floor(Math.random() * tithis.length)];
  };

  const getRandomGrahaTransit = () => {
    const grahas = ['Jupiter', 'Saturn', 'Mars', 'Venus', 'Mercury'];
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio'];
    const graha = grahas[Math.floor(Math.random() * grahas.length)];
    const sign = signs[Math.floor(Math.random() * signs.length)];
    return `${graha} in ${sign}`;
  };

  const fillRandomData = (index) => {
    const newDates = [...dates];
    newDates[index] = {
      ...newDates[index],
      tithi: getRandomTithi(),
      grahaTransit: getRandomGrahaTransit()
    };
    setDates(newDates);
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
            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <div className="taglines">
                  {uploadedFiles.map((file, index) => (
                    <span key={index} className="tagline-item">
                      📄 {file.filename || `File ${index + 1}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

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

            {dates.map((dateItem, index) => (
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
                    <button
                      type="button"
                      onClick={() => fillRandomData(index)}
                      style={{ 
                        background: 'rgba(102, 126, 234, 0.1)', 
                        border: '1px solid rgba(102, 126, 234, 0.3)', 
                        color: '#667eea', 
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Fill Sample Data
                    </button>
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
            ))}
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