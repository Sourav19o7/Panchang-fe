

// ==================================================
// 13. src/components/pdf/PDFUploader.js
// ==================================================
import React, { useState, useCallback } from 'react';
import { Upload, File, X, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import pdfService from '../../services/pdfService';

const PDFUploader = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFileSelect = useCallback((selectedFiles) => {
    const newFiles = Array.from(selectedFiles);
    const validation = pdfService.validateFiles(newFiles);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    const fileObjects = validation.validFiles.map(file => ({
      file,
      id: Math.random().toString(36),
      name: file.name,
      size: file.size,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...fileObjects]);
  }, []);

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    try {
      setUploading(true);
      
      const filesToUpload = files
        .filter(f => f.status === 'pending')
        .map(f => f.file);

      const result = await pdfService.uploadFiles(filesToUpload, (progress) => {
        setUploadProgress({ overall: progress });
      });

      if (result.success) {
        setFiles(prev => prev.map(f => ({
          ...f,
          status: 'completed'
        })));
        
        toast.success(`Successfully uploaded ${result.data.length} files`);
        
        if (onUploadComplete) {
          onUploadComplete(result.data);
        }
      }
    } catch (error) {
      toast.error('Upload failed');
      setFiles(prev => prev.map(f => ({
        ...f,
        status: 'error'
      })));
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <div className="pdf-uploader">
      <div 
        className="upload-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="file-input"
          id="pdf-upload"
        />
        
        <label htmlFor="pdf-upload" className="upload-label">
          <Upload size={48} className="upload-icon" />
          <h3>Upload PDF Documents</h3>
          <p>Drag and drop PDFs here, or click to browse</p>
          <small>Maximum 5 files, 10MB each</small>
        </label>
      </div>

      {files.length > 0 && (
        <div className="files-list">
          <h4>Selected Files ({files.length})</h4>
          
          {files.map((fileObj) => (
            <div key={fileObj.id} className="file-item">
              <div className="file-info">
                <File size={20} className="file-icon" />
                <div className="file-details">
                  <span className="file-name">{fileObj.name}</span>
                  <span className="file-size">{pdfService.formatFileSize(fileObj.size)}</span>
                </div>
              </div>
              
              <div className="file-status">
                {fileObj.status === 'pending' && (
                  <button
                    onClick={() => removeFile(fileObj.id)}
                    className="remove-btn"
                    disabled={uploading}
                  >
                    <X size={16} />
                  </button>
                )}
                {fileObj.status === 'completed' && (
                  <Check size={16} className="text-success" />
                )}
                {fileObj.status === 'error' && (
                  <X size={16} className="text-error" />
                )}
              </div>
            </div>
          ))}

          {uploadProgress.overall && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${uploadProgress.overall}%` }}
                />
              </div>
              <span>{uploadProgress.overall}% uploaded</span>
            </div>
          )}

          <div className="upload-actions">
            <button
              onClick={uploadFiles}
              disabled={uploading || files.every(f => f.status !== 'pending')}
              className="btn btn-primary"
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </button>
            
            <button
              onClick={() => setFiles([])}
              disabled={uploading}
              className="btn btn-outline"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;