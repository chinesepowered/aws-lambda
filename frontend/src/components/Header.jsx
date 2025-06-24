import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <div className="flex items-center justify-center mb-4">
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-full p-3 shadow-lg mr-4"
        >
          <Receipt className="w-8 h-8 text-indigo-600" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Smart Receipt Analyzer
          </h1>
        </motion.div>
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3 
          }}
          className="ml-4"
        >
          <Sparkles className="w-6 h-6 text-yellow-300" />
        </motion.div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
      >
        Upload your receipts and let AWS Lambda + Textract extract expense data automatically.
        <br />
        <span className="text-yellow-300 font-medium">Perfect for expense management automation!</span>
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="mt-6 inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm"
      >
        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
        Powered by AWS Lambda & Textract
      </motion.div>
    </motion.header>
  );
};

export default Header;