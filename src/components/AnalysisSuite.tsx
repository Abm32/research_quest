import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  LineChart,
  PieChart,
  ScatterChart,
  Download,
  Upload,
  Filter,
  Settings,
  Database,
  FileSpreadsheet,
  Share2,
  HelpCircle,
  ArrowRight,
  Menu
} from 'lucide-react';

interface AnalysisTool {
  icon: React.FC<any>;
  title: string;
  description: string;
  features: string[];
}

export default function AnalysisSuite() {
  const [selectedTool, setSelectedTool] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const analysisTools: AnalysisTool[] = [
    {
      icon: BarChart2,
      title: 'Statistical Analysis',
      description: 'Perform statistical tests and generate insights from your data',
      features: [
        'Descriptive statistics',
        'Hypothesis testing',
        'Correlation analysis',
        'Regression models'
      ]
    },
    {
      icon: LineChart,
      title: 'Time Series Analysis',
      description: 'Analyze trends and patterns over time',
      features: [
        'Trend decomposition',
        'Seasonality analysis',
        'Forecasting',
        'Anomaly detection'
      ]
    },
    {
      icon: PieChart,
      title: 'Data Visualization',
      description: 'Create beautiful and informative visualizations',
      features: [
        'Interactive charts',
        'Custom themes',
        'Multiple chart types',
        'Export options'
      ]
    },
    {
      icon: ScatterChart,
      title: 'Correlation Analysis',
      description: 'Explore relationships between variables',
      features: [
        'Scatter plots',
        'Correlation matrices',
        'Heat maps',
        'Regression lines'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Menu className="w-6 h-6 text-indigo-600" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-8 md:mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Analysis Suite</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Powerful tools to analyze and visualize your research data
        </p>
      </motion.div>

      {/* Quick Actions - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
        {[
          { icon: Upload, label: 'Upload Data' },
          { icon: Download, label: 'Export Results' },
          { icon: Filter, label: 'Filter Data' },
          { icon: Settings, label: 'Settings' }
        ].map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center justify-center p-3 md:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <action.icon className="w-5 h-5 text-indigo-600 mb-2" />
            <span className="text-sm md:text-base text-center">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Analysis Tools - Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {analysisTools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
              selectedTool === tool.title ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setSelectedTool(tool.title)}
          >
            <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-indigo-50 rounded-lg">
                <tool.icon className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">{tool.title}</h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{tool.description}</p>
            <ul className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
              {tool.features.map((feature) => (
                <li key={feature} className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              className="w-full flex items-center justify-center space-x-2 p-2 md:p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle tool opening
              }}
            >
              <span className="text-sm md:text-base">Open Tool</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Additional Features - Responsive Grid */}
      <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-3 md:mb-4">
            <Database className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
            <h3 className="text-base md:text-lg font-semibold">Data Management</h3>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Import, organize, and manage your research data with ease.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-3 md:mb-4">
            <Share2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
            <h3 className="text-base md:text-lg font-semibold">Collaboration</h3>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Share your analysis with team members and get feedback.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-3 md:mb-4">
            <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
            <h3 className="text-base md:text-lg font-semibold">Support</h3>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Get help and guidance for your data analysis needs.
          </p>
        </motion.div>
      </div>
    </div>
  );
} 