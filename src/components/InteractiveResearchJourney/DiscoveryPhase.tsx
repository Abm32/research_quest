import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lightbulb, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export function DiscoveryPhase() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);

  const suggestions = [
    {
      id: '1',
      title: 'Machine Learning',
      description: 'Explore artificial intelligence and machine learning algorithms.',
      relevance: 95,
      color: 'from-purple-500 to-indigo-500',
      keywords: ['AI', 'Neural Networks', 'Deep Learning']
    },
    {
      id: '2',
      title: 'Data Science',
      description: 'Analyze and interpret complex data sets.',
      relevance: 88,
      color: 'from-blue-500 to-cyan-500',
      keywords: ['Big Data', 'Analytics', 'Statistics']
    },
    {
      id: '3',
      title: 'Cognitive Psychology',
      description: 'Study mental processes and human behavior.',
      relevance: 82,
      color: 'from-green-500 to-teal-500',
      keywords: ['Memory', 'Perception', 'Learning']
    },
    {
      id: '4',
      title: 'Climate Change',
      description: 'Research environmental impacts and solutions.',
      relevance: 78,
      color: 'from-orange-500 to-red-500',
      keywords: ['Environment', 'Global Warming', 'Sustainability']
    },
    {
      id: '5',
      title: 'Quantum Computing',
      description: 'Explore quantum mechanics and computation.',
      relevance: 75,
      color: 'from-pink-500 to-rose-500',
      keywords: ['Quantum Mechanics', 'Computing', 'Physics']
    }
  ];

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    suggestion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    suggestion.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    // You can add additional logic here, like navigating to a detailed view
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search research topics or keywords..."
          className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredSuggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="group relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => handleTopicSelect(suggestion.title)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.color} opacity-5 group-hover:opacity-10 transition-opacity rounded-xl`} />
              <div className="flex items-start space-x-4">
                <div className={`p-3 bg-gradient-to-br ${suggestion.color} rounded-xl`}>
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{suggestion.title}</h3>
                    <span className="text-sm text-indigo-600 font-medium">
                      {suggestion.relevance}% match
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 mb-3">
                    {suggestion.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {suggestion.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 group">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredSuggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No research topics found matching your search.</p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-indigo-600 hover:text-indigo-700"
            >
              Clear search
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}