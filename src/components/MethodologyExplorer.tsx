import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Search, FileText, Database, ChevronRight, ArrowRight, Lightbulb, Users, BarChart2, Microscope, FlaskRound as Flask, ClipboardList } from 'lucide-react';

interface Methodology {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: string[];
  resources: {
    title: string;
    url: string;
  }[];
  tools: string[];
  examples: string[];
}

export default function MethodologyExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedMethodology, setExpandedMethodology] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Methods', icon: Search },
    { id: 'qualitative', label: 'Qualitative', icon: FileText },
    { id: 'quantitative', label: 'Quantitative', icon: Database },
    { id: 'mixed', label: 'Mixed Methods', icon: Flask },
    { id: 'experimental', label: 'Experimental', icon: Microscope }
  ];

  const methodologies: Methodology[] = [
    {
      id: 'case-study',
      title: 'Case Study Research',
      description: 'In-depth investigation of a particular case (individual, group, event) within its real-life context.',
      category: 'qualitative',
      difficulty: 'intermediate',
      steps: [
        'Define research question and case selection criteria',
        'Develop data collection protocol',
        'Gather multiple sources of evidence',
        'Analyze data using pattern matching',
        'Write comprehensive case report'
      ],
      resources: [
        { title: 'Case Study Research Guide', url: '/guides/case-study' },
        { title: 'Data Collection Templates', url: '/templates/case-study' }
      ],
      tools: ['Interview protocols', 'Observation checklists', 'Document analysis frameworks'],
      examples: ['Company transformation study', 'Educational program evaluation', 'Community development project']
    },
    {
      id: 'survey-research',
      title: 'Survey Research',
      description: 'Systematic method for gathering information from a sample of individuals to understand population characteristics.',
      category: 'quantitative',
      difficulty: 'beginner',
      steps: [
        'Define research objectives',
        'Design survey instrument',
        'Select sampling method',
        'Conduct pilot test',
        'Administer survey',
        'Analyze results'
      ],
      resources: [
        { title: 'Survey Design Best Practices', url: '/guides/survey-design' },
        { title: 'Statistical Analysis Tools', url: '/tools/statistics' }
      ],
      tools: ['Survey software', 'Statistical analysis packages', 'Data visualization tools'],
      examples: ['Customer satisfaction survey', 'Employee engagement study', 'Market research']
    },
    {
      id: 'mixed-methods',
      title: 'Mixed Methods Research',
      description: 'Integration of qualitative and quantitative methods to provide comprehensive understanding.',
      category: 'mixed',
      difficulty: 'advanced',
      steps: [
        'Define research problem requiring mixed approach',
        'Select appropriate mixed methods design',
        'Collect both qualitative and quantitative data',
        'Analyze each type of data separately',
        'Integrate findings',
        'Draw meta-inferences'
      ],
      resources: [
        { title: 'Mixed Methods Framework', url: '/guides/mixed-methods' },
        { title: 'Integration Techniques', url: '/tools/integration' }
      ],
      tools: ['Qualitative analysis software', 'Statistical packages', 'Integration matrices'],
      examples: ['Health intervention study', 'Educational program evaluation', 'Organizational change research']
    }
  ];

  const filteredMethodologies = methodologies.filter(methodology => {
    const matchesSearch = methodology.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         methodology.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || methodology.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Research Methodology Explorer</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover and learn about different research methodologies to enhance your investigative approach.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search methodologies..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mb-8">
        <div className="flex space-x-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {filteredMethodologies.map((methodology) => (
          <motion.div
            key={methodology.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedMethodology(
                expandedMethodology === methodology.id ? null : methodology.id
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{methodology.title}</h3>
                  <p className="mt-2 text-gray-600">{methodology.description}</p>
                  <div className="flex items-center space-x-4 mt-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      methodology.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      methodology.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {methodology.difficulty.charAt(0).toUpperCase() + methodology.difficulty.slice(1)}
                    </span>
                    <span className="text-gray-500 flex items-center">
                      <ClipboardList className="w-4 h-4 mr-1" />
                      {methodology.steps.length} steps
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedMethodology === methodology.id ? 'rotate-90' : ''
                }`} />
              </div>
            </div>

            {expandedMethodology === methodology.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 px-6 py-6 bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Implementation Steps</h4>
                    <ol className="space-y-3">
                      {methodology.steps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm mr-3">
                            {index + 1}
                          </span>
                          <span className="text-gray-600">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Recommended Resources</h4>
                      <div className="space-y-3">
                        {methodology.resources.map((resource, index) => (
                          <Link
                            key={index}
                            to={resource.url}
                            className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">{resource.title}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Example Applications</h4>
                      <div className="space-y-2">
                        {methodology.examples.map((example, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-gray-600"
                          >
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <span>{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredMethodologies.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No methodologies found</h3>
          <p className="text-gray-600 mt-2">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}