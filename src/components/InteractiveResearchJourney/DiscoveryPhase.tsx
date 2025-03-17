import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  BookOpen,
  ArrowUpRight,
  Check,
  Compass,
  ThumbsUp,
  ThumbsDown,
  HelpCircle
} from 'lucide-react';
import { useAIAssistant } from '../../App';
import { researchService } from '../../services/researchService';
import { TopicExplorer } from './TopicExplorer';

interface Topic {
  id: string;
  title: string;
  description: string;
  relevance: number;
  color: string;
  keywords: string[];
  researchers: number;
  discussions: number;
  trending: boolean;
  category: string;
  papers?: number;
  citations?: number;
  selectionReason?: string;
  researchInterests?: string[];
  researchGoals?: string[];
}

interface DiscoveryPhaseProps {
  projectId: string;
  onPhaseComplete: () => Promise<void>;
}

interface TopicSelection {
  topic: Topic;
  reason: string;
  interests: string[];
  goals: string[];
}

export function DiscoveryPhase({ projectId, onPhaseComplete }: DiscoveryPhaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [showTopicExplorer, setShowTopicExplorer] = useState(false);
  const [relatedTopics, setRelatedTopics] = useState<Topic[]>([]);
  const [topicProgress, setTopicProgress] = useState(0);
  const [topicSelection, setTopicSelection] = useState<TopicSelection | null>(null);
  const [showGuidedQuestions, setShowGuidedQuestions] = useState(false);
  const { setIsOpen } = useAIAssistant();

  const suggestions: Topic[] = [
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
      category: 'technology',
      papers: 15000,
      citations: 250000
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
      category: 'technology',
      papers: 12000,
      citations: 180000
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
      category: 'psychology',
      papers: 8000,
      citations: 120000
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
      category: 'environmental',
      papers: 10000,
      citations: 200000
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
      category: 'physics',
      papers: 5000,
      citations: 80000
    }
  ];

  const filters = [
    { id: 'all', label: 'All Topics' },
    { id: 'technology', label: 'Technology' },
    { id: 'psychology', label: 'Psychology' },
    { id: 'environmental', label: 'Environmental' },
    { id: 'physics', label: 'Physics' }
  ];

  useEffect(() => {
    if (selectedTopic) {
      const related = suggestions.filter(topic => 
        topic.id !== selectedTopic.id && 
        (topic.category === selectedTopic.category || 
         topic.keywords.some(k => selectedTopic.keywords.includes(k)))
      );
      setRelatedTopics(related);
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (selectedTopic && isExploring && topicSelection?.reason) {
      const timer = setInterval(() => {
        setTopicProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(timer);
    }
  }, [selectedTopic, isExploring, topicSelection]);

  useEffect(() => {
    if (topicProgress === 100) {
      researchService.updateProjectProgress(projectId, 'discovery', 100)
        .then(() => {
          onPhaseComplete();
        })
        .catch(console.error);
    }
  }, [topicProgress, projectId, onPhaseComplete]);

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

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowGuidedQuestions(true);
    setIsExploring(false);
    setTopicProgress(0);
    setShowTopicExplorer(false);
  };

  const handleGuidedQuestionsSubmit = (
    reason: string,
    interests: string[],
    goals: string[]
  ) => {
    if (!selectedTopic) return;

    const selection: TopicSelection = {
      topic: selectedTopic,
      reason,
      interests,
      goals
    };

    setTopicSelection(selection);
    setIsExploring(true);
    setShowGuidedQuestions(false);

    // Save the topic selection to the project
    researchService.updateProjectTopic(projectId, {
      ...selectedTopic,
      selectionReason: reason,
      researchInterests: interests,
      researchGoals: goals
    }).catch(console.error);
  };

  const handleProceedToDesign = () => {
    if (topicProgress === 100) {
      onPhaseComplete();
    }
  };

  if (showTopicExplorer) {
    return (
      <TopicExplorer
        onBack={() => setShowTopicExplorer(false)}
        onTopicSelect={handleTopicSelect}
      />
    );
  }

  if (showGuidedQuestions) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedTopic(null);
              setShowGuidedQuestions(false);
            }}
            className="text-gray-600 hover:text-gray-900 text-sm flex items-center space-x-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to topics</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className={`p-4 bg-gradient-to-br ${selectedTopic?.color} rounded-xl text-white mb-6`}>
            <h2 className="text-2xl font-bold mb-2">{selectedTopic?.title}</h2>
            <p className="opacity-90">{selectedTopic?.description}</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why are you interested in this topic?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                placeholder="Share what sparked your interest in this research area..."
                onChange={(e) => setTopicSelection(prev => prev ? {
                  ...prev,
                  reason: e.target.value
                } : {
                  topic: selectedTopic!,
                  reason: e.target.value,
                  interests: [],
                  goals: []
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What specific aspects interest you the most?
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedTopic?.keywords.map(keyword => (
                  <button
                    key={keyword}
                    onClick={() => setTopicSelection(prev => {
                      if (!prev) return {
                        topic: selectedTopic!,
                        reason: '',
                        interests: [keyword],
                        goals: []
                      };
                      return {
                        ...prev,
                        interests: prev.interests.includes(keyword)
                          ? prev.interests.filter(k => k !== keyword)
                          : [...prev.interests, keyword]
                      };
                    })}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      topicSelection?.interests.includes(keyword)
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are your research goals?
              </label>
              <div className="space-y-2">
                {[
                  'Understanding the fundamentals',
                  'Exploring practical applications',
                  'Contributing to existing research',
                  'Solving specific problems',
                  'Developing new methodologies'
                ].map(goal => (
                  <button
                    key={goal}
                    onClick={() => setTopicSelection(prev => {
                      if (!prev) return {
                        topic: selectedTopic!,
                        reason: '',
                        interests: [],
                        goals: [goal]
                      };
                      return {
                        ...prev,
                        goals: prev.goals.includes(goal)
                          ? prev.goals.filter(g => g !== goal)
                          : [...prev.goals, goal]
                      };
                    })}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      topicSelection?.goals.includes(goal)
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (topicSelection?.reason && topicSelection.interests.length > 0 && topicSelection.goals.length > 0) {
                  handleGuidedQuestionsSubmit(
                    topicSelection.reason,
                    topicSelection.interests,
                    topicSelection.goals
                  );
                }
              }}
              disabled={!topicSelection?.reason || !topicSelection.interests.length || !topicSelection.goals.length}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Begin Topic Exploration
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (selectedTopic && isExploring) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedTopic(null);
              setIsExploring(false);
              setTopicProgress(0);
              setTopicSelection(null);
            }}
            className="text-gray-600 hover:text-gray-900 text-sm flex items-center space-x-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to topics</span>
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Exploration progress</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${topicProgress}%` }}
                className="h-full bg-indigo-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className={`p-4 bg-gradient-to-br ${selectedTopic.color} rounded-xl text-white mb-6`}>
            <h2 className="text-2xl font-bold mb-2">{selectedTopic.title}</h2>
            <p className="opacity-90">{selectedTopic.description}</p>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Your Research Focus</h3>
              <p className="text-indigo-700 mb-4">{topicSelection?.reason}</p>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-indigo-900 mb-2">Key Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {topicSelection?.interests.map(interest => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-indigo-900 mb-2">Research Goals</h4>
                  <div className="space-y-2">
                    {topicSelection?.goals.map(goal => (
                      <div
                        key={goal}
                        className="px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm"
                      >
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Research Papers</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{selectedTopic.papers?.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <ArrowUpRight className="w-5 h-5" />
                  <span>Citations</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{selectedTopic.citations?.toLocaleString()}</p>
              </div>
            </div>

            {relatedTopics.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedTopics.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors text-left"
                    >
                      <h4 className="font-medium text-gray-900">{topic.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {topicProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center bg-green-50 p-4 rounded-xl"
          >
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="w-5 h-5" />
              <span>Topic exploration complete!</span>
            </div>
            <button
              onClick={handleProceedToDesign}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Proceed to Design Phase
            </button>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Topic Discovery</h2>
          <p className="text-gray-600">Find and explore research topics that match your interests.</p>
        </div>
        <button
          onClick={() => setShowTopicExplorer(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Compass className="w-5 h-5" />
          <span>Explore More Topics</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-8">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">New to Research?</h3>
            <p className="opacity-90 mb-4">
              Don't worry! We'll guide you through the process of finding the perfect research topic.
              Start by exploring trending topics or use our topic explorer for more options.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-opacity-90 transition-colors text-sm"
            >
              <Bot className="w-4 h-4" />
              <span>Get AI Assistance</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search research topics or keywords..."
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
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
            className="group relative p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => handleTopicSelect(suggestion)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.color} opacity-5 group-hover:opacity-10 transition-opacity rounded-xl`} />
            <div className="flex items-start space-x-3">
              <div className={`p-2 sm:p-3 bg-gradient-to-br ${suggestion.color} rounded-xl flex-shrink-0`}>
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {suggestion.title}
                  </h3>
                      {suggestion.trending && (
                    <span className="flex items-center space-x-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                          <TrendingUp className="w-3 h-3" />
                      <span>Trending</span>
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{suggestion.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestion.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      <Hash className="w-3 h-3" />
                      <span>{keyword}</span>
                    </span>
                  ))}
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
                    <span>Explore</span>
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