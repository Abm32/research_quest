import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  Database,
  FileText,
  Filter,
  ChevronDown,
  Clock,
  User,
  Star,
  Check,
  AlertCircle,
  HelpCircle,
  Share2,
  Bookmark,
  ExternalLink
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  accessType: 'Free' | 'Premium' | 'Subscription';
  icon: React.FC<any>;
  url: string;
  popularityScore: number;
  tutorialAvailable: boolean;
}

type ToolCategory = 
  | 'Literature Review' 
  | 'Data Collection' 
  | 'Data Analysis' 
  | 'Visualization' 
  | 'Writing' 
  | 'Collaboration';

interface FilterState {
  categories: ToolCategory[];
  difficulty: ('Beginner' | 'Intermediate' | 'Advanced')[];
  accessType: ('Free' | 'Premium' | 'Subscription')[];
}

const InvestigationTools: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    difficulty: [],
    accessType: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'difficulty'>('popularity');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  
  // Sample tools data
  const toolsData: Tool[] = [
    {
      id: '1',
      name: 'Research Paper Explorer',
      description: 'Search and organize academic papers across multiple databases with AI-powered recommendations.',
      category: 'Literature Review',
      difficulty: 'Beginner',
      accessType: 'Free',
      icon: BookOpen,
      url: '/tools/paper-explorer',
      popularityScore: 95,
      tutorialAvailable: true
    },
    {
      id: '2',
      name: 'Data Collection Assistant',
      description: 'User-friendly tools for creating surveys, forms, and experiments to gather research data.',
      category: 'Data Collection',
      difficulty: 'Beginner',
      accessType: 'Free',
      icon: Database,
      url: '/tools/data-collection',
      popularityScore: 88,
      tutorialAvailable: true
    },
    {
      id: '3',
      name: 'Statistical Analysis Kit',
      description: 'Simplified statistical analysis with step-by-step guidance for beginners.',
      category: 'Data Analysis',
      difficulty: 'Intermediate',
      accessType: 'Free',
      icon: Search,
      url: '/tools/statistical-analysis',
      popularityScore: 92,
      tutorialAvailable: true
    },
    {
      id: '4',
      name: 'Research Visualizer',
      description: 'Create compelling charts, diagrams, and infographics to visualize your research findings.',
      category: 'Visualization',
      difficulty: 'Beginner',
      accessType: 'Free',
      icon: FileText,
      url: '/tools/research-visualizer',
      popularityScore: 85,
      tutorialAvailable: true
    },
    {
      id: '5',
      name: 'Advanced Data Mining',
      description: 'Powerful tools for extracting insights from large datasets using machine learning algorithms.',
      category: 'Data Analysis',
      difficulty: 'Advanced',
      accessType: 'Premium',
      icon: Database,
      url: '/tools/data-mining',
      popularityScore: 78,
      tutorialAvailable: false
    },
    {
      id: '6',
      name: 'Collaborative Writing Studio',
      description: 'Write and edit research papers collaboratively with real-time feedback and version control.',
      category: 'Writing',
      difficulty: 'Intermediate',
      accessType: 'Free',
      icon: FileText,
      url: '/tools/writing-studio',
      popularityScore: 90,
      tutorialAvailable: true
    },
    {
      id: '7',
      name: 'Research Team Hub',
      description: 'Centralized workspace for research teams to communicate, share files, and track progress.',
      category: 'Collaboration',
      difficulty: 'Beginner',
      accessType: 'Free',
      icon: Search,
      url: '/tools/team-hub',
      popularityScore: 89,
      tutorialAvailable: true
    },
    {
      id: '8',
      name: 'Citation Generator',
      description: 'Automatically generate and manage citations in multiple formats for your research papers.',
      category: 'Writing',
      difficulty: 'Beginner',
      accessType: 'Free',
      icon: FileText,
      url: '/tools/citation',
      popularityScore: 94,
      tutorialAvailable: true
    }
  ];

  // Filter and sort tools based on user input
  const filteredTools = toolsData
    .filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategories = filters.categories.length === 0 || 
                                filters.categories.includes(tool.category);
      
      const matchesDifficulty = filters.difficulty.length === 0 || 
                                filters.difficulty.includes(tool.difficulty);
      
      const matchesAccessType = filters.accessType.length === 0 || 
                                filters.accessType.includes(tool.accessType);
      
      return matchesSearch && matchesCategories && matchesDifficulty && matchesAccessType;
    })
    .sort((a, b) => {
      if (sortBy === 'popularity') return b.popularityScore - a.popularityScore;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'difficulty') {
        const difficultyOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      return 0;
    });

  const handleCategoryFilter = (category: ToolCategory) => {
    setFilters(prev => {
      if (prev.categories.includes(category)) {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  const handleDifficultyFilter = (difficulty: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setFilters(prev => {
      if (prev.difficulty.includes(difficulty)) {
        return { ...prev, difficulty: prev.difficulty.filter(d => d !== difficulty) };
      } else {
        return { ...prev, difficulty: [...prev.difficulty, difficulty] };
      }
    });
  };

  const handleAccessTypeFilter = (accessType: 'Free' | 'Premium' | 'Subscription') => {
    setFilters(prev => {
      if (prev.accessType.includes(accessType)) {
        return { ...prev, accessType: prev.accessType.filter(a => a !== accessType) };
      } else {
        return { ...prev, accessType: [...prev.accessType, accessType] };
      }
    });
  };

  const clearFilters = () => {
    setFilters({ categories: [], difficulty: [], accessType: [] });
    setSearchQuery('');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-amber-100 text-amber-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessTypeColor = (accessType: string) => {
    switch (accessType) {
      case 'Free': return 'bg-blue-100 text-blue-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Subscription': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="bg-gradient-to-r from-teal-700 to-blue-800 text-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Investigation Tools</h1>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Discover powerful tools to enhance your research journey, from data collection to analysis and visualization.
          </p>
          
          {/* Search Bar */}
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-teal-200" />
              </div>
              <input
                type="text"
                className="block w-full py-3 pl-10 pr-12 border border-transparent rounded-lg bg-teal-600 bg-opacity-40 focus:bg-teal-500 focus:bg-opacity-40 placeholder-teal-200 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent shadow-inner"
                placeholder="Search research tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center mr-3 px-2 py-1 rounded-md bg-teal-500 bg-opacity-40 hover:bg-opacity-60 transition-colors"
                >
                  <Filter className="h-4 w-4 text-teal-100" />
                  <span className="ml-1 text-sm text-teal-100">Filter</span>
                  <ChevronDown 
                    className={`h-3 w-3 ml-1 text-teal-100 transition-transform duration-300 ${showFilters ? 'transform rotate-180' : ''}`} 
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Filters Section */}
      <motion.div
        initial="hidden"
        animate={showFilters ? "visible" : "hidden"}
        variants={{
          visible: { height: 'auto', opacity: 1 },
          hidden: { height: 0, opacity: 0 }
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mb-8"
      >
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                <select 
                  className="p-2 border rounded-md text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="popularity">Popularity</option>
                  <option value="name">Name</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
              <button 
                onClick={clearFilters}
                className="text-sm text-teal-600 hover:text-teal-800"
              >
                Clear filters
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Category</h3>
              <div className="space-y-2">
                {(['Literature Review', 'Data Collection', 'Data Analysis', 'Visualization', 'Writing', 'Collaboration'] as ToolCategory[]).map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryFilter(category)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Difficulty</h3>
              <div className="space-y-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((difficulty) => (
                  <div key={difficulty} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`difficulty-${difficulty}`}
                      checked={filters.difficulty.includes(difficulty)}
                      onChange={() => handleDifficultyFilter(difficulty)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`difficulty-${difficulty}`} className="ml-2 text-sm text-gray-700">
                      {difficulty}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Access Type</h3>
              <div className="space-y-2">
                {(['Free', 'Premium', 'Subscription'] as const).map((accessType) => (
                  <div key={accessType} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`access-${accessType}`}
                      checked={filters.accessType.includes(accessType)}
                      onChange={() => handleAccessTypeFilter(accessType)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`access-${accessType}`} className="ml-2 text-sm text-gray-700">
                      {accessType}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Available Tools</h2>
          <p className="text-sm text-gray-600">
            Found {filteredTools.length} tools
          </p>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tools found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                onClick={() => setSelectedTool(tool)}
              >
                <div className="h-2 bg-gradient-to-r from-teal-600 to-blue-700"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-teal-50 rounded-lg">
                        <tool.icon className="h-6 w-6 text-teal-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                        <p className="text-sm text-gray-500">{tool.category}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {tool.tutorialAvailable && (
                        <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800">
                          <HelpCircle className="mr-1 h-3 w-3" />
                          Tutorial
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                    {tool.description}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(tool.difficulty)}`}>
                      {tool.difficulty}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getAccessTypeColor(tool.accessType)}`}>
                      {tool.accessType}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      <span>{tool.popularityScore}% satisfaction</span>
                    </div>
                    <button
                      className="px-3 py-1 text-sm font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTool(tool);
                      }}
                    >
                      Learn more
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Tool Detail Modal */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-2 bg-gradient-to-r from-teal-600 to-blue-700"></div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-2rem)]">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-teal-100 rounded-xl">
                    <selectedTool.icon className="h-8 w-8 text-teal-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTool.name}</h2>
                    <p className="text-teal-700">{selectedTool.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTool(null)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-gray-600">{selectedTool.description}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Difficulty Level</h4>
                  <div className="mt-1 flex items-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(selectedTool.difficulty)}`}>
                      {selectedTool.difficulty}
                    </span>
                    <div className="ml-2">
                      {selectedTool.difficulty === 'Beginner' && 'Perfect for newcomers to research'}
                      {selectedTool.difficulty === 'Intermediate' && 'Some research experience recommended'}
                      {selectedTool.difficulty === 'Advanced' && 'For experienced researchers'}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Access Type</h4>
                  <div className="mt-1 flex items-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getAccessTypeColor(selectedTool.accessType)}`}>
                      {selectedTool.accessType}
                    </span>
                    <div className="ml-2">
                      {selectedTool.accessType === 'Free' && 'No cost to use'}
                      {selectedTool.accessType === 'Premium' && 'Paid features available'}
                      {selectedTool.accessType === 'Subscription' && 'Requires ongoing subscription'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Features</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Interactive research tools for thorough investigation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Step-by-step guidance for beginners</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Seamless integration with the Research Quest platform</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Export and share your findings with peers</span>
                  </li>
                </ul>
              </div>

              {selectedTool.tutorialAvailable && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Tutorial</h3>
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg text-blue-700">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      <span className="font-medium">Interactive tutorial available</span>
                    </div>
                    <p className="mt-1 text-sm">
                      Learn how to use this tool effectively with our step-by-step tutorial.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">User Satisfaction</h3>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-amber-500 h-2.5 rounded-full" 
                      style={{ width: `${selectedTool.popularityScore}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{selectedTool.popularityScore}%</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <a
                  href={selectedTool.url}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Tool
                </a>
                <button
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save for Later
                </button>
                <button
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </button>
              </div>

              {/* Related Tools */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Related Tools</h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {toolsData
                    .filter(tool => 
                      tool.id !== selectedTool.id && 
                      tool.category === selectedTool.category
                    )
                    .slice(0, 2)
                    .map(tool => (
                      <div 
                        key={tool.id} 
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedTool(tool)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-teal-50 rounded-md">
                            <tool.icon className="h-4 w-4 text-teal-700" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{tool.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{tool.description}</p>
                                                      </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Getting Started Guide Section */}
      <section className="mt-16 bg-gradient-to-r from-blue-800 to-teal-700 rounded-xl text-white overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row">
          <div className="p-8 md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">New to Research?</h2>
            <p className="mb-6">
              Our guided investigation process will help you build research skills step-by-step. 
              Start with beginner-friendly tools and work your way up to advanced techniques.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Last updated: {new Date('2025-02-26T12:50:08').toLocaleDateString()}</h3>
                  <p className="text-sm text-teal-100">Our tools are regularly improved based on user feedback</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 flex-shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Welcome back, {/*currentUser?.displayName ||*/ 'Abm32'}</h3>
                  <p className="text-sm text-teal-100">Continue your research journey where you left off</p>
                </div>
              </div>
            </div>
            <button className="mt-6 bg-white text-teal-800 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors">
              Start Research Guide
            </button>
          </div>
          <div className="hidden md:block md:w-1/3 relative">
            <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="2.5" cy="2.5" r="1.5" fill="rgba(255, 255, 255, 0.3)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-full flex items-center justify-center">
                <Compass className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Used Tools */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Recently Used Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {toolsData.slice(0, 4).map((tool, index) => (
            <motion.div
              key={`recent-${tool.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedTool(tool)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${index % 2 === 0 ? 'from-teal-500 to-blue-500' : 'from-blue-500 to-teal-500'}`}>
                  <tool.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium text-gray-800">{tool.name}</h3>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Last used: 2 days ago</span>
                <span className={`px-2 py-0.5 rounded-full ${getDifficultyColor(tool.difficulty)}`}>
                  {tool.difficulty}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Research Resources */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Research Resources</h2>
        <p className="text-gray-600 mb-6">
          Enhance your research skills with these curated educational resources
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <BookOpen className="h-8 w-8 text-blue-700 mb-4" />
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Research Methodologies</h3>
            <p className="text-gray-700 mb-4">
              Learn about different research approaches, from qualitative to quantitative methods.
            </p>
            <a href="#" className="text-blue-700 font-medium flex items-center hover:text-blue-800">
              <span>Explore methodologies</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <Database className="h-8 w-8 text-amber-700 mb-4" />
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Data Analysis Techniques</h3>
            <p className="text-gray-700 mb-4">
              Step-by-step guides to various data analysis methods for your research.
            </p>
            <a href="#" className="text-amber-700 font-medium flex items-center hover:text-amber-800">
              <span>Learn techniques</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-teal-50 p-6 rounded-xl border border-teal-100">
            <FileText className="h-8 w-8 text-teal-700 mb-4" />
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Academic Writing</h3>
            <p className="text-gray-700 mb-4">
              Improve your writing skills for research papers, theses, and publications.
            </p>
            <a href="#" className="text-teal-700 font-medium flex items-center hover:text-teal-800">
              <span>Start writing</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-gray-500 pb-8">
        <p>© 2025 Research Quest. All rights reserved.</p>
        <p>Last updated: {new Date('2025-02-26T12:50:08').toLocaleDateString()}</p>
      </footer>
    </div>
  );
};


export default InvestigationTools;
                
                