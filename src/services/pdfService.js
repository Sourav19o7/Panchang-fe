

// src/services/pdfService.js
import { apiHelpers, endpoints } from '../config/api';

class PDFService {
  // Upload PDF files
  async uploadFiles(files, onProgress = null) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('pdfs', file);
      });

      const response = await apiHelpers.upload(
        endpoints.puja.uploadPDFs, 
        formData, 
        onProgress
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // List available PDF files
  async listFiles() {
    try {
      const response = await apiHelpers.get(endpoints.puja.listPDFs);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Validate PDF files
  validateFiles(files) {
    const errors = [];
    const validFiles = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return { isValid: false, errors, validFiles: [] };
    }

    files.forEach((file, index) => {
      if (file.type !== 'application/pdf') {
        errors.push(`File ${index + 1}: Only PDF files are allowed`);
      } else if (file.size > maxSize) {
        errors.push(`File ${index + 1}: File size must be less than 10MB`);
      } else {
        validFiles.push(file);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      validFiles
    };
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get file extension
  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  // Check if file is PDF
  isPDFFile(file) {
    return file.type === 'application/pdf' || 
           this.getFileExtension(file.name).toLowerCase() === 'pdf';
  }
}

export default new PDFService();