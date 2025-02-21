import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Lightbulb,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  Users,
  MessageCircle,
  Hash,
  Bot,
  ChevronDown
} from 'lucide-react';
import { useAIAssistant } from '../../App';

export function DiscoveryPhase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { setIsOpen } = useAIAssistant();

  const suggestions = [
    {
      id: '1',
      title: 'Machine Learning',
      description: 'Explore artificial intelligence and machine learning algorithms.',
      relevance: 95,
      color: 'from-purple-500 to-indigo-500',
      keywords: ['AI', 'Neural Networks', 'Deep Learning'],
      researchers: 1234,
      discussions: 456,
      trending: true,
      category: 'technology'
    },
    {
      id: '2',
      title: 'Data Science',
      description: 'Analyze and interpret complex data sets.',
      relevance: 88,
      color: 'from-blue-500 to-cyan-500',
      keywords: ['Big Data', 'Analytics', 'Statistics'],
      researchers: 987,
      discussions: 234,
      trending: true,
      category: 'technology'
    },
    {
      id: '3',
      title: 'Cognitive Psychology',
      description: 'Study mental processes and human behavior.',
      relevance: 82,
      color: 'from-green-500 to-teal-500',
      keywords: ['Memory', 'Perception', 'Learning'],
      researchers: 567,
      discussions: 123,
      trending: false,
      category: 'psychology'
    },
    {
      id: '4',
      title: 'Climate Change',
      description: 'Research environmental impacts and solutions.',
      relevance: 78,
      color: 'from-orange-500 to-red-500',
      keywords: ['Environment', 'Global Warming', 'Sustainability'],
      researchers: 789,
      discussions: 345,
      trending: true,
      category: 'environmental'
    },
    {
      id: '5',
      title: 'Quantum Computing',
      description: 'Explore quantum mechanics and computation.',
      relevance: 75,
      color: 'from-pink-500 to-rose-500',
      keywords: ['Quantum Mechanics', 'Computing', 'Physics'],
      researchers: 432,
      discussions: 167,
      trending: false,
      category: 'physics'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Topics' },
    { id: 'technology', label: 'Technology' },
    { id: 'psychology', label: 'Psychology' },
    { id: 'environmental', label: 'Environmental' },
    { id: 'physics', label: 'Physics' }
  ];

  const filteredSuggestions = suggestions
    .filter(suggestion => {
      const matchesSearch = 
        suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesFilter = activeFilter === 'all' || suggestion.category === activeFilter;
      return matchesSearch && matchesFilter;
    });

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    // Additional logic for topic selection
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search research topics or keywords..."
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
        <button
          onClick={() => setIsOpen(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
        >
          <Bot className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span>Filters</span>
          {activeFilter !== 'all' && (
            <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
              Active
            </span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
              <div className="flex space-x-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors
                      ${activeFilter === filter.id
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredSuggestions.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group relative p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => handleTopicSelect(suggestion.title)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.color} opacity-5 group-hover:opacity-10 transition-opacity rounded-xl`} />
            <div className="flex items-start space-x-3">
              <div className={`p-2 sm:p-3 bg-gradient-to-br ${suggestion.color} rounded-xl flex-shrink-0`}>
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{suggestion.title}</h3>
                      {suggestion.trending && (
                        <span className="flex items-center space-x-1 px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-xs">
                          <TrendingUp className="w-3 h-3" />
                          <span className="hidden sm:inline">Trending</span>
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-indigo-600 font-medium">
                      {suggestion.relevance}% match
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2">
                  {suggestion.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestion.keywords.slice(0, 2).map((keyword) => (
                    <span
                      key={keyword}
                      className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      <Hash className="w-3 h-3" />
                      <span>{keyword}</span>
                    </span>
                  ))}
                  {suggestion.keywords.length > 2 && (
                    <span className="text-xs text-gray-500">+{suggestion.keywords.length - 2} more</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{suggestion.researchers.toLocaleString()} researchers</span>
                    </div>
                    <div className="hidden sm:flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{suggestion.discussions} discussions</span>
                    </div>
                  </div>
                  <button className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 group text-sm">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSuggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-sm">No research topics found matching your search.</p>
          <div className="mt-4 space-x-4">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                Clear search
              </button>
            )}
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                Show all topics
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}