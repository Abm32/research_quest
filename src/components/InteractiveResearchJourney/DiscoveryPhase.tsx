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
import { gamificationService } from '../../services/gamificationService';
import { useAuth } from '../../components/auth/AuthContext';
import type { Topic } from '../../types';

interface TopicSelection {
  topic: Topic;
  interests: string[];
  goals: string[];
  reason: string;
}

interface DiscoveryPhaseProps {
  projectId: string;
  onPhaseComplete: () => Promise<void>;
}

export function DiscoveryPhase({ projectId, onPhaseComplete }: DiscoveryPhaseProps) {
  const { user } = useAuth();
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
      title: 'Quantum Computing Applications',
      description: 'Exploring practical applications of quantum computing in cryptography and optimization problems.',
      keywords: ['quantum computing', 'cryptography', 'optimization'],
      researchers: ['Dr. Sarah Johnson', 'Prof. Michael Chen'],
      discussions: ['Latest breakthroughs', 'Industry applications'],
      relevance: 95,
      trending: true,
      color: 'blue',
      category: 'Computer Science',
      papers: 150,
      citations: 1200
    },
    {
      id: '2',
      title: 'Sustainable Energy Solutions',
      description: 'Investigating renewable energy technologies and their impact on climate change.',
      keywords: ['renewable energy', 'climate change', 'sustainability'],
      researchers: ['Dr. Emily Brown', 'Prof. David Wilson'],
      discussions: ['Policy implications', 'Technology adoption'],
      relevance: 90,
      trending: true,
      color: 'green',
      category: 'Environmental Science',
      papers: 200,
      citations: 1800
    },
    {
      id: '3',
      title: 'AI in Healthcare',
      description: 'Examining the role of artificial intelligence in medical diagnosis and treatment planning.',
      keywords: ['artificial intelligence', 'healthcare', 'medical diagnosis'],
      researchers: ['Dr. James Smith', 'Prof. Lisa Chen'],
      discussions: ['Clinical applications', 'Ethical considerations'],
      relevance: 85,
      trending: true,
      color: 'purple',
      category: 'Healthcare',
      papers: 180,
      citations: 1500
    },
    {
      id: '4',
      title: 'Neural Networks in Robotics',
      description: 'Advancing robotic systems through deep learning and neural network architectures.',
      keywords: ['robotics', 'deep learning', 'neural networks'],
      researchers: ['Dr. Robert Wilson', 'Prof. Maria Garcia'],
      discussions: ['Control systems', 'Human-robot interaction'],
      relevance: 88,
      trending: true,
      color: 'indigo',
      category: 'Robotics',
      papers: 160,
      citations: 1400
    },
    {
      id: '5',
      title: 'Bioinformatics and Genomics',
      description: 'Analyzing genetic data and developing computational tools for biological research.',
      keywords: ['genomics', 'bioinformatics', 'data analysis'],
      researchers: ['Dr. Thomas Lee', 'Prof. Rachel Kim'],
      discussions: ['Gene sequencing', 'Disease prediction'],
      relevance: 92,
      trending: true,
      color: 'pink',
      category: 'Biology',
      papers: 220,
      citations: 2000
    },
    {
      id: '6',
      title: 'Cybersecurity in IoT',
      description: 'Addressing security challenges in the Internet of Things ecosystem.',
      keywords: ['cybersecurity', 'IoT', 'network security'],
      researchers: ['Dr. Alex Turner', 'Prof. Sarah Martinez'],
      discussions: ['Vulnerability assessment', 'Security protocols'],
      relevance: 87,
      trending: true,
      color: 'red',
      category: 'Security',
      papers: 170,
      citations: 1600
    },
    {
      id: '7',
      title: 'Space Exploration Technologies',
      description: 'Developing innovative technologies for space exploration and colonization.',
      keywords: ['space technology', 'astronomy', 'aerospace'],
      researchers: ['Dr. Neil Patel', 'Prof. Emily Chen'],
      discussions: ['Mars colonization', 'Space tourism'],
      relevance: 89,
      trending: true,
      color: 'yellow',
      category: 'Space Science',
      papers: 190,
      citations: 1700
    },
    {
      id: '8',
      title: 'Digital Privacy and Ethics',
      description: 'Investigating privacy concerns and ethical implications in the digital age.',
      keywords: ['privacy', 'ethics', 'data protection'],
      researchers: ['Dr. Sophia Brown', 'Prof. David Lee'],
      discussions: ['Data rights', 'Privacy laws'],
      relevance: 86,
      trending: true,
      color: 'orange',
      category: 'Ethics',
      papers: 165,
      citations: 1450
    }
  ];

  const filters = [
    { id: 'all', label: 'All Topics' },
    { id: 'Computer Science', label: 'Computer Science' },
    { id: 'Environmental Science', label: 'Environmental Science' },
    { id: 'Healthcare', label: 'Healthcare' },
    { id: 'Robotics', label: 'Robotics' },
    { id: 'Biology', label: 'Biology' },
    { id: 'Security', label: 'Security' },
    { id: 'Space Science', label: 'Space Science' },
    { id: 'Ethics', label: 'Ethics' }
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

  const handleTopicSelect = async (topic: Topic) => {
    setSelectedTopic(topic);
    setIsExploring(true);
    setTopicProgress(0);
    setTopicSelection({
      topic,
      interests: [],
      goals: [],
      reason: ''
    });

    // Award achievement for topic selection
    if (user) {
      await gamificationService.awardAchievement(user.uid, {
        title: 'Topic Explorer',
        description: 'Selected your first research topic',
        type: 'milestone',
        points: 100,
        category: 'Discovery',
        icon: 'Star',
        color: 'amber',
        phase: 'discovery'
      });
    }
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

  const handleProjectCreation = async () => {
    if (!user || !selectedTopic) return;

    try {
      // Create new project
      const project = await researchService.createProject(user.uid, {
        title: `${selectedTopic.title} Research Project`,
        description: `Research project on ${selectedTopic.title}`,
        phase: 'discovery',
        status: 'active',
        progress: 0,
        topic: selectedTopic,
        tasks: []
      });

      // Award achievement for project creation
      await gamificationService.awardAchievement(user.uid, {
        title: 'Project Pioneer',
        description: 'Created your first research project',
        type: 'milestone',
        points: 200,
        category: 'Project Management',
        icon: 'Trophy',
        color: 'blue',
        phase: 'discovery'
      });

      // Award points for completing discovery phase
      await gamificationService.awardPoints(user.uid, 500, 'Completed Discovery Phase');

      // Award achievement for completing discovery phase
      await gamificationService.awardAchievement(user.uid, {
        title: 'Discovery Master',
        description: 'Successfully completed the discovery phase',
        type: 'badge',
        points: 300,
        category: 'Research Progress',
        icon: 'Award',
        color: 'green',
        phase: 'discovery'
      });

      // Navigate to next phase
      onPhaseComplete();
    } catch (error) {
      console.error('Error creating project:', error);
      // Handle error appropriately
    }
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
              onClick={handleProjectCreation}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Project & Continue
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
        <div className="flex space-x-4">
          <button
            onClick={() => setShowTopicExplorer(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Compass className="w-5 h-5" />
            <span>Explore More Topics</span>
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Bot className="w-5 h-5" />
            <span>Get AI Assistance</span>
          </button>
        </div>
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
            <div className="flex space-x-4">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-opacity-90 transition-colors text-sm"
              >
                <Bot className="w-4 h-4" />
                <span>Get AI Assistance</span>
              </button>
              <button
                onClick={() => setShowTopicExplorer(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Browse All Topics</span>
              </button>
            </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <span>{suggestion.researchers?.length} researchers</span>
                    </div>
                    <div className="hidden sm:flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{suggestion.discussions?.length} discussions</span>
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