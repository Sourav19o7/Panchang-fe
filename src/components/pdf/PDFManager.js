

// ==================================================
// 14. src/components/pdf/PDFManager.js
// ==================================================
import React, { useState, useEffect } from 'react';
import { File, Download, Trash2, Eye, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import pdfService from '../../services/pdfService';
import PDFUploader from './PDFUploader';
import Loading from '../common/Loading';
import { formatDate } from '../../utils/helpers';

const PDFManager = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    loadPDFs();
  }, []);

  const loadPDFs = async () => {
    try {
      setLoading(true);
      const result = await pdfService.listFiles();
      if (result.success) {
        setPdfs(result.data);
      }
    } catch (error) {
      console.error('Failed to load PDFs:', error);
      toast.error('Failed to load PDF list');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (uploadedFiles) => {
    setPdfs(prev => [...prev, ...uploadedFiles]);
    setShowUploader(false);
    toast.success('Files uploaded successfully');
  };

  const deletePDF = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }

    try {
      // In a real implementation, you'd call the delete API
      setPdfs(prev => prev.filter(pdf => pdf.filename !== filename));
      toast.success('PDF deleted successfully');
    } catch (error) {
      toast.error('Failed to delete PDF');
    }
  };

  const filteredPDFs = pdfs.filter(pdf => 
    pdf.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading message="Loading PDFs..." />;
  }

  return (
    <div className="pdf-manager">
      <div className="page-header">
        <div>
          <h1 className="page-title">PDF Document Manager</h1>
          <p className="page-subtitle">Manage reference documents for AI processing</p>
        </div>
        
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="btn btn-primary"
        >
          {showUploader ? 'Cancel' : 'Upload PDFs'}
        </button>
      </div>

      {showUploader && (
        <div className="uploader-section">
          <PDFUploader onUploadComplete={handleUploadComplete} />
        </div>
      )}

      <div className="search-section">
        <div className="search-input">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PDFs..."
            className="form-input"
          />
        </div>
      </div>

      <div className="pdfs-grid">
        {filteredPDFs.length === 0 ? (
          <div className="empty-state">
            <File size={48} className="empty-icon" />
            <h3>No PDFs found</h3>
            <p>Upload your first PDF documents to get started</p>
          </div>
        ) : (
          filteredPDFs.map((pdf) => (
            <div key={pdf.filename} className="pdf-card">
              <div className="pdf-header">
                <File size={24} className="pdf-icon" />
                <div className="pdf-info">
                  <h3 className="pdf-name">{pdf.filename}</h3>
                  <div className="pdf-meta">
                    <span className="pdf-size">{pdfService.formatFileSize(pdf.size)}</span>
                    {pdf.pages && <span className="pdf-pages">{pdf.pages} pages</span>}
                  </div>
                </div>
              </div>

              {pdf.created && (
                <p className="pdf-date">
                  Uploaded: {formatDate(pdf.created)}
                </p>
              )}

              <div className="pdf-actions">
                <button
                  className="btn btn-sm btn-outline"
                  title="View PDF"
                >
                  <Eye size={14} />
                </button>
                
                <button
                  className="btn btn-sm btn-outline"
                  title="Download PDF"
                >
                  <Download size={14} />
                </button>
                
                <button
                  onClick={() => deletePDF(pdf.filename)}
                  className="btn btn-sm btn-error"
                  title="Delete PDF"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredPDFs.length > 0 && (
        <div className="pdfs-summary">
          <p>{filteredPDFs.length} PDF{filteredPDFs.length !== 1 ? 's' : ''} found</p>
        </div>
      )}
    </div>
  );
};

export default PDFManager;