import React from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Store, 
  Calendar, 
  DollarSign, 
  Tag, 
  Receipt, 
  TrendingUp,
  Star
} from 'lucide-react';

const ResultsVisualization = ({ results }) => {
  if (!results || !results.success) {
    return null;
  }

  const { data } = results;
  
  const categoryColors = {
    'Food & Dining': '#FF6B6B',
    'Transportation': '#4ECDC4',
    'Travel & Lodging': '#45B7D1',
    'Office Supplies': '#96CEB4',
    'Fuel': '#FFEAA7',
    'Major Purchase': '#DDA0DD',
    'General': '#98D8C8'
  };

  const itemsData = data.items.map(item => ({
    name: item.name,
    value: item.price
  }));

  const confidenceData = [
    { name: 'Confidence', value: data.confidence },
    { name: 'Remaining', value: 100 - data.confidence }
  ];

  const COLORS = ['#4F46E5', '#E5E7EB'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Receipt Analysis Results</h2>
          <p className="text-indigo-100">Extracted data from your receipt using AWS Textract</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200"
            >
              <div className="flex items-center justify-between mb-3">
                <Store className="w-8 h-8 text-green-600" />
                <span className="text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">
                  MERCHANT
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">{data.merchant || 'Unknown'}</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
            >
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="w-8 h-8 text-blue-600" />
                <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                  TOTAL
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-2xl">${data.total?.toFixed(2) || '0.00'}</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
            >
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-8 h-8 text-orange-600" />
                <span className="text-xs font-medium text-orange-600 bg-orange-200 px-2 py-1 rounded-full">
                  DATE
                </span>
              </div>
              <h3 className="font-semibold text-gray-800">{data.date || 'Not detected'}</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200"
            >
              <div className="flex items-center justify-between mb-3">
                <Tag className="w-8 h-8 text-purple-600" />
                <span className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
                  CATEGORY
                </span>
              </div>
              <h3 className="font-semibold text-gray-800">{data.category}</h3>
              <div 
                className="w-full h-2 rounded-full mt-2"
                style={{ backgroundColor: categoryColors[data.category] || '#98D8C8' }}
              />
            </motion.div>
          </div>

          {data.items && data.items.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Receipt className="w-5 h-5 mr-2 text-indigo-600" />
                  Line Items
                </h3>
                <div className="space-y-3">
                  {data.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm"
                    >
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <span className="font-semibold text-indigo-600">${item.price?.toFixed(2) || '0.00'}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                  Item Breakdown
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={itemsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#4F46E5" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-indigo-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Processing Confidence</h3>
                  <p className="text-gray-600 text-sm">AWS Textract accuracy score</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-20 mr-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={confidenceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={35}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {confidenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-indigo-600">{data.confidence}%</span>
                  <div className={`text-sm font-medium ${
                    data.confidence >= 90 ? 'text-green-600' : 
                    data.confidence >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {data.confidence >= 90 ? 'Excellent' : 
                     data.confidence >= 70 ? 'Good' : 'Fair'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsVisualization;