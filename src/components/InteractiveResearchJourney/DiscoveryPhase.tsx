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
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { useAIAssistant } from '../../App';
import { researchService } from '../../services/researchService';
import { TopicExplorer } from './TopicExplorer';
import { gamificationService } from '../../services/gamificationService';
import { useAuth } from '../../components/auth/AuthContext';
import { saveUserInteraction } from '../../services/topicService';
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
  const [topics, setTopics] = useState<Topic[]>([]);

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
        icon: 'compass',
        color: 'blue'
      });
    }

    // Show guided questions for better topic understanding
    setShowGuidedQuestions(true);

    // Generate related topics
    const related = suggestions.filter(t => 
      t.id !== topic.id && 
      (t.category === topic.category || 
       t.keywords.some(k => topic.keywords.includes(k)))
    );
    setRelatedTopics(related);

    // Update project progress
    await researchService.updateProjectProgress(projectId, 'discovery', 50);
  };

  const handleTopicConfirm = async () => {
    if (!topicSelection || !user) return;

    try {
      // Save topic selection with detailed information
      await researchService.updateProjectTopic(projectId, {
        ...topicSelection.topic,
        selectionReason: topicSelection.reason,
        researchInterests: topicSelection.interests,
        researchGoals: topicSelection.goals
      });

      // Update progress
      setTopicProgress(100);
      await researchService.updateProjectProgress(projectId, 'discovery', 100);

      // Award points for completing topic selection
      await gamificationService.awardPoints(user.uid, 200, 'Topic Selection Completed');

      // Move to next phase
      await onPhaseComplete();
    } catch (error) {
      console.error('Error confirming topic:', error);
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

  const handleTopicInterest = async (topic: Topic, type: 'like' | 'view') => {
    try {
      if (!user?.uid) return;

      // Update topic with user interaction
      const updatedTopic: Topic = {
        ...topic,
        userInteractions: [
          ...(topic.userInteractions || []),
          {
            type: type === 'like' ? 'like' : 'view',
            timestamp: new Date()
          }
        ]
      };

      // Save user interaction
      await saveUserInteraction(user.uid, topic.id, {
        type: type === 'like' ? 'like' : 'view',
        timestamp: new Date()
      });

      // Award points for interaction
      await gamificationService.awardPoints(
        user.uid,
        type === 'like' ? 5 : 2,
        `Topic ${type === 'like' ? 'Liked' : 'Viewed'}: ${topic.title}`
      );

      // Update local state
      setTopics(prevTopics => 
        prevTopics.map(t => t.id === topic.id ? updatedTopic : t)
      );
    } catch (error) {
      console.error('Error handling topic interest:', error);
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
      {!isExploring ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Research Topic Discovery</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <Bot className="w-5 h-5" />
                <span>Get AI Help</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search research topics or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Hash className="w-5 h-5 text-gray-500" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuggestions.map((topic) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                    <p className="text-sm text-gray-600">{topic.category}</p>
                  </div>
                  <span className="text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    {topic.relevance}% match
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{topic.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {topic.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {topic.papers} papers
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {topic.discussions.length} discussions
                    </span>
                  </div>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {topic.researchers.length} researchers
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <button
                      onClick={() => handleTopicInterest(topic, 'like')}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleTopicInterest(topic, 'view')}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleTopicSelect(topic)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <span>Explore Topic</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {selectedTopic && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTopic.title}</h2>
                  <p className="text-gray-600 mt-2">{selectedTopic.category}</p>
                </div>
                <button
                  onClick={() => setIsExploring(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Overview</h3>
                  <p className="text-gray-600 mb-4">{selectedTopic.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedTopic.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Relevance Score</span>
                      <span className="font-medium text-green-600">{selectedTopic.relevance}% match</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Research Papers</span>
                      <span className="font-medium text-gray-900">{selectedTopic.papers}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Citations</span>
                      <span className="font-medium text-gray-900">{selectedTopic.citations}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Community</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Active Researchers</h4>
                      <div className="space-y-2">
                        {selectedTopic.researchers.map((researcher) => (
                          <div key={researcher} className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{researcher}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Current Discussions</h4>
                      <div className="space-y-2">
                        {selectedTopic.discussions.map((discussion) => (
                          <div key={discussion} className="flex items-center space-x-2">
                            <MessageCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{discussion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {showGuidedQuestions && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Guided Questions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What interests you about this topic?
                      </label>
                      <textarea
                        value={topicSelection?.interests.join(', ')}
                        onChange={(e) => setTopicSelection(prev => ({
                          ...prev!,
                          interests: e.target.value.split(',').map(i => i.trim())
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter your interests, separated by commas..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What are your research goals?
                      </label>
                      <textarea
                        value={topicSelection?.goals.join(', ')}
                        onChange={(e) => setTopicSelection(prev => ({
                          ...prev!,
                          goals: e.target.value.split(',').map(g => g.trim())
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter your research goals, separated by commas..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Why did you choose this topic?
                      </label>
                      <textarea
                        value={topicSelection?.reason}
                        onChange={(e) => setTopicSelection(prev => ({
                          ...prev!,
                          reason: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={3}
                        placeholder="Explain your motivation for choosing this topic..."
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setIsExploring(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopicConfirm}
                  disabled={!topicSelection?.reason || topicSelection.interests.length === 0 || topicSelection.goals.length === 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Topic Selection
                </button>
              </div>
            </motion.div>
          )}

          {relatedTopics.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Topics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTopics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h4>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {topic.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleTopicSelect(topic)}
                      className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Explore Topic
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}