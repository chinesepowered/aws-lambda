import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileImage, AlertCircle, CheckCircle } from 'lucide-react';

const UploadZone = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }
    
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and PDF files are supported';
    }
    
    return null;
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setValidationError('');
    
    if (rejectedFiles.length > 0) {
      setValidationError('Invalid file type or size');
      return;
    }
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const error = validateFile(file);
      
      if (error) {
        setValidationError(error);
        return;
      }
      
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  const getDropzoneClassName = () => {
    let baseClass = 'relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 transform hover:scale-105';
    
    if (isDragAccept) {
      return `${baseClass} border-green-400 bg-green-50`;
    }
    if (isDragReject) {
      return `${baseClass} border-red-400 bg-red-50`;
    }
    if (isDragActive) {
      return `${baseClass} border-indigo-400 bg-indigo-50`;
    }
    
    return `${baseClass} border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div {...getRootProps({ className: getDropzoneClassName() })}>
          <input {...getInputProps()} />
          
          <motion.div
            animate={{ 
              y: isDragActive ? -10 : 0,
              scale: isDragActive ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            {isDragActive ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6"
              >
                <Upload className="w-10 h-10 text-indigo-600" />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ rotate: 5 }}
                className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6"
              >
                <FileImage className="w-10 h-10 text-gray-600" />
              </motion.div>
            )}
            
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {isDragActive ? 'Drop your receipt here!' : 'Upload Receipt'}
            </h3>
            
            <p className="text-gray-600 mb-4 max-w-md">
              {isDragActive 
                ? 'Release to upload and process your receipt'
                : 'Drag and drop your receipt image or PDF, or click to browse'
              }
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                JPG, PNG, PDF
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                Max 10MB
              </span>
            </div>
          </motion.div>
          
          {!isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"
            />
          )}
        </div>
        
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            {validationError}
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-500">
            Your receipt will be processed using AWS Textract for accurate data extraction
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UploadZone;