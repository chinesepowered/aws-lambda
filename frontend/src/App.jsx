import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UploadZone from './components/UploadZone';
import ResultsVisualization from './components/ResultsVisualization';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import { Receipt, AlertCircle, CheckCircle } from 'lucide-react';

const App = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processingResults, setProcessingResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setError(null);
    setProcessingResults(null);
    
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      
      setUploadProgress(25);
      
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME || 'smart-receipt-analyzer-receipts-dev';
      const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
      
      setUploadProgress(50);
      
      const mockResults = {
        success: true,
        data: {
          merchant: "STARBUCKS COFFEE",
          total: 12.45,
          date: "2024-06-24",
          category: "Food & Dining",
          items: [
            { name: "GRANDE LATTE", price: 5.95 },
            { name: "BLUEBERRY MUFFIN", price: 3.25 },
            { name: "TAX", price: 0.75 }
          ],
          confidence: 92
        }
      };
      
      setUploadProgress(75);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      setProcessingResults(mockResults);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to process receipt. Please try again.');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const resetApp = () => {
    setUploadedFile(null);
    setProcessingResults(null);
    setError(null);
    setIsProcessing(false);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </motion.div>
          )}

          {!uploadedFile && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <UploadZone onFileUpload={handleFileUpload} />
            </motion.div>
          )}

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-2xl p-8 text-center"
            >
              <LoadingSpinner progress={uploadProgress} />
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Processing Your Receipt
                </h3>
                <p className="text-gray-600">
                  Using AWS Textract to extract expense data...
                </p>
              </div>
            </motion.div>
          )}

          {processingResults && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Receipt processed successfully! Confidence: {processingResults.data.confidence}%
              </div>
              
              <ResultsVisualization results={processingResults} />
              
              <div className="text-center">
                <button
                  onClick={resetApp}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
                >
                  Process Another Receipt
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default App;