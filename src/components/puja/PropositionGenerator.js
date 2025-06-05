

// ==================================================
// 6. src/components/puja/PropositionGenerator.js
// ==================================================
import React, { useState } from 'react';
import { Plus, Calendar, Upload, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import pujaService from '../../services/pujaService';
import pdfService from '../../services/pdfService';
import Loading from '../common/Loading';

const PropositionGenerator = () => {
  const { selectedMonth, selectedYear } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    month: selectedMonth,
    year: selectedYear,
    theme: '',
    focusDeity: '',
    targetAudience: '',
    specialEvents: []
  });
  const [pdfFiles, setPdfFiles] = useState([]);
  const [propositions, setPropositions] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const generatePropositions = async () => {
    try {
      setLoading(true);
      
      // Generate focus suggestion first
      const focusResult = await pujaService.generateFocusSuggestion({
        month: formData.month,
        year: formData.year,
        theme: formData.theme,
        pdfFiles: pdfFiles.map(f => f.filename)
      });

      if (focusResult.success) {
        toast.success('Focus suggestions generated');
        
        // Generate actual propositions
        const propositionResult = await pujaService.generatePropositions({
          month: formData.month,
          year: formData.year,
          focusTheme: formData.theme,
          dates: getDatesForMonth(formData.month, formData.year),
          pdfFiles: pdfFiles.map(f => f.filename)
        });

        if (propositionResult.success) {
          setPropositions(propositionResult.data.propositions);
          toast.success(`Generated ${propositionResult.data.count} propositions`);
        }
      }
    } catch (error) {
      toast.error('Failed to generate propositions');
    } finally {
      setLoading(false);
    }
  };

  const getDatesForMonth = (month, year) => {
    // Mock function - in real implementation, this would get important dates from Panchang
    const daysInMonth = new Date(year, month, 0).getDate();
    const importantDates = [];
    
    for (let day = 1; day <= daysInMonth; day += 7) {
      importantDates.push({
        date: new Date(year, month - 1, day).toISOString().split('T')[0],
        tithi: 'Sample Tithi',
        grahaTransit: 'Sample Transit',
        deity: formData.focusDeity || 'Ganesha',
        useCase: 'General Blessing'
      });
    }
    
    return importantDates;
  };

  if (loading) {
    return <Loading message="Generating propositions..." />;
  }

  return (
    <div className="proposition-generator">
      <div className="page-header">
        <h1 className="page-title">Generate Puja Propositions</h1>
        <p className="page-subtitle">Create AI-powered puja propositions for your calendar</p>
      </div>

      <div className="generator-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="month">Month</label>
              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className="form-select"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2023, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="form-select"
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
            <label htmlFor="theme">Theme (Optional)</label>
            <input
              type="text"
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., Prosperity, Health, Spiritual Growth"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="focusDeity">Focus Deity (Optional)</label>
            <select
              id="focusDeity"
              name="focusDeity"
              value={formData.focusDeity}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Auto-select based on calendar</option>
              <option value="Ganesha">Ganesha</option>
              <option value="Lakshmi">Lakshmi</option>
              <option value="Shiva">Shiva</option>
              <option value="Durga">Durga</option>
              <option value="Krishna">Krishna</option>
              <option value="Hanuman">Hanuman</option>
            </select>
          </div>
        </div>

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
              <small>Click to upload or drag and drop PDFs</small>
            </label>
          </div>
          
          {pdfFiles.length > 0 && (
            <div className="uploaded-files">
              <h4>Uploaded Files:</h4>
              <ul>
                {pdfFiles.map((file, index) => (
                  <li key={index}>{file.filename}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            onClick={generatePropositions}
            disabled={loading}
            className="btn btn-primary"
          >
            <Sparkles size={16} />
            Generate Propositions
          </button>
        </div>
      </div>

      {propositions.length > 0 && (
        <div className="propositions-results">
          <h3>Generated Propositions</h3>
          <div className="propositions-grid">
            {propositions.map((proposition, index) => (
              <div key={index} className="proposition-card">
                <h4>{proposition.pujaName}</h4>
                <p><strong>Deity:</strong> {proposition.deity}</p>
                <p><strong>Use Case:</strong> {proposition.useCase}</p>
                <p><strong>Date:</strong> {proposition.date}</p>
                <div className="proposition-actions">
                  <button className="btn btn-sm btn-primary">Edit</button>
                  <button className="btn btn-sm btn-outline">Preview</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropositionGenerator;