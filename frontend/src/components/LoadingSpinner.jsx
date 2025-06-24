import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileSearch, Brain, CheckCircle } from 'lucide-react';

const LoadingSpinner = ({ progress = 0 }) => {
  const getStepIcon = (step, currentProgress) => {
    const stepProgress = step * 25;
    
    if (currentProgress > stepProgress) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else if (currentProgress === stepProgress) {
      return <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />;
    } else {
      return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
    }
  };

  const steps = [
    { id: 1, label: 'Uploading to S3', icon: 'upload' },
    { id: 2, label: 'Lambda Processing', icon: 'process' },
    { id: 3, label: 'Textract Analysis', icon: 'analyze' },
    { id: 4, label: 'Extracting Data', icon: 'extract' }
  ];

  return (
    <div className="flex flex-col items-center space-y-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="w-20 h-20 border-4 border-indigo-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-8 h-8 text-indigo-600" />
        </div>
      </motion.div>

      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              progress >= (index + 1) * 25 
                ? 'bg-green-50 border border-green-200' 
                : progress === (index + 1) * 25
                ? 'bg-indigo-50 border border-indigo-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            {getStepIcon(index + 1, progress)}
            <span className={`text-sm font-medium ${
              progress >= (index + 1) * 25 
                ? 'text-green-700' 
                : progress === (index + 1) * 25
                ? 'text-indigo-700'
                : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center max-w-md"
      >
        <p className="text-sm text-gray-600 leading-relaxed">
          Our AWS Lambda function is analyzing your receipt using advanced OCR technology. 
          This usually takes just a few seconds.
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;