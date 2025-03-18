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
  ArrowLeft,
  Globe,
  Link,
  Save,
  Share2,
  ExternalLink,
  CheckCircle
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

interface Community {
  id: string;
  name: string;
  platform: 'reddit' | 'discord';
  members: number;
  description: string;
  url: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'paper' | 'dataset' | 'tool';
  description: string;
  url: string;
  source: string;
  citations?: number;
}

interface Team {
  id: string;
  name: string;
  members: string[];
  topic: string;
  description: string;
}

interface PhaseTask {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  type: 'required' | 'common';
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
  const [communities, setCommunities] = useState<Community[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCommunities, setShowCommunities] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [phaseTasks, setPhaseTasks] = useState<PhaseTask[]>([
    {
      id: 'select-topic',
      title: 'Select Research Topic',
      description: 'Choose a topic from suggestions or enter a custom topic',
      points: 20,
      completed: false,
      type: 'required'
    },
    {
      id: 'bookmark-papers',
      title: 'Bookmark Resources',
      description: 'Save at least 3 research papers or resources',
      points: 15,
      completed: false,
      type: 'required'
    },
    {
      id: 'join-community',
      title: 'Join Research Community',
      description: 'Connect with a Reddit, Discord, or in-app community',
      points: 10,
      completed: false,
      type: 'required'
    },
    {
      id: 'connect-collaborator',
      title: 'Connect with Collaborators',
      description: 'Find a research partner or confirm solo research',
      points: 15,
      completed: false,
      type: 'required'
    },
    {
      id: 'read-guide',
      title: 'Read Research Guide',
      description: 'Complete the "How to Choose a Research Topic" guide',
      points: 10,
      completed: false,
      type: 'common'
    },
    {
      id: 'ethics-quiz',
      title: 'Research Ethics Quiz',
      description: 'Take a short quiz on research ethics',
      points: 15,
      completed: false,
      type: 'common'
    },
    {
      id: 'community-post',
      title: 'Community Engagement',
      description: 'Share your research interests in the community forum',
      points: 10,
      completed: false,
      type: 'common'
    }
  ]);

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

  const handleJoinCommunity = async (community: Community) => {
    if (!user) return;
    
    try {
      // Open community in new tab
      window.open(community.url, '_blank');
      
      // Award points for joining community
      await gamificationService.awardPoints(
        user.uid,
        10,
        `Joined ${community.platform} community: ${community.name}`
      );
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleSaveResource = async (resource: Resource) => {
    if (!user) return;
    
    try {
      setSavedResources(prev => [...prev, resource]);
      
      // Award points for saving resource
      await gamificationService.awardPoints(
        user.uid,
        5,
        `Saved resource: ${resource.title}`
      );
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleJoinTeam = async (team: Team) => {
    if (!user) return;
    
    try {
      // Add user to team
      const updatedTeam = {
        ...team,
        members: [...team.members, user.uid]
      };
      
      // Update team in database
      await researchService.updateTeam(team.id, updatedTeam);
      
      // Award points for joining team
      await gamificationService.awardPoints(
        user.uid,
        20,
        `Joined research team: ${team.name}`
      );
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

  const handleExploreMore = () => {
    setSelectedTopic(null);
    setIsExploring(false);
    setTopicProgress(0);
    setTopicSelection(null);
    setShowGuidedQuestions(false);
    setSearchQuery('');
    setActiveFilter('all');
    setShowFilters(false);
    setShowCommunities(false);
    setShowResources(false);
    setShowTeams(false);
  };

  const handleTaskComplete = async (taskId: string) => {
    if (!user) return;
    
    try {
      setPhaseTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      ));

      const task = phaseTasks.find(t => t.id === taskId);
      if (task) {
        await gamificationService.awardPoints(
          user.uid,
          task.points,
          `Completed task: ${task.title}`
        );
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const isPhaseComplete = () => {
    return phaseTasks
      .filter(task => task.type === 'required')
      .every(task => task.completed);
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Exploring Topic</h2>
          <button
            onClick={handleExploreMore}
            className="flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <Compass className="h-5 w-5 mr-2" />
            Explore More Topics
          </button>
        </div>

        {/* Topic Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className={`p-4 bg-gradient-to-br ${selectedTopic.color} rounded-xl text-white mb-6`}>
            <h2 className="text-2xl font-bold mb-2">{selectedTopic.title}</h2>
            <p className="opacity-90">{selectedTopic.description}</p>
          </div>

          {/* Communities Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Research Communities</h3>
              <button
                onClick={() => setShowCommunities(!showCommunities)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                {showCommunities ? 'Hide Communities' : 'Show Communities'}
              </button>
            </div>
            
            {showCommunities && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communities.map(community => (
                  <div key={community.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{community.name}</h4>
                      <span className="text-sm text-gray-500">{community.members} members</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{community.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        <Globe className="w-4 h-4 inline mr-1" />
                        {community.platform}
                      </span>
                      <button
                        onClick={() => handleJoinCommunity(community)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        Join Community
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resources Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Research Resources</h3>
              <button
                onClick={() => setShowResources(!showResources)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                {showResources ? 'Hide Resources' : 'Show Resources'}
              </button>
            </div>
            
            {showResources && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map(resource => (
                  <div key={resource.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{resource.title}</h4>
                      <span className="text-sm text-gray-500">{resource.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4 inline mr-1" />
                          View Resource
                        </a>
                        <button
                          onClick={() => handleSaveResource(resource)}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                      {resource.citations && (
                        <span className="text-sm text-gray-500">
                          {resource.citations} citations
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teams Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Research Teams</h3>
              <button
                onClick={() => setShowTeams(!showTeams)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                {showTeams ? 'Hide Teams' : 'Show Teams'}
              </button>
            </div>
            
            {showTeams && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map(team => (
                  <div key={team.id} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{team.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{team.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        <Users className="w-4 h-4 inline mr-1" />
                        {team.members.length} members
                      </span>
                      <button
                        onClick={() => handleJoinTeam(team)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        Join Team
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress and Next Steps */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
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
              {topicProgress === 100 && (
                <button
                  onClick={handleProjectCreation}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Move to Design Phase
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Phase Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Discovery Phase</h2>
            <p className="text-gray-600 mt-1">Find your research topic and collaborators</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Required Tasks</div>
              <div className="text-lg font-semibold text-indigo-600">
                {phaseTasks.filter(t => t.type === 'required' && t.completed).length} / 
                {phaseTasks.filter(t => t.type === 'required').length}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Common Tasks</div>
              <div className="text-lg font-semibold text-green-600">
                {phaseTasks.filter(t => t.type === 'common' && t.completed).length} / 
                {phaseTasks.filter(t => t.type === 'common').length}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phaseTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border ${
                task.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-indigo-600">
                    +{task.points} points
                  </span>
                  {task.completed ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <button
                      onClick={() => handleTaskComplete(task.id)}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Explorer */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Topic Explorer</h2>
            <p className="text-gray-600 mt-1">Discover and explore research topics</p>
          </div>
          <button
            onClick={() => setShowTopicExplorer(!showTopicExplorer)}
            className="flex items-center text-indigo-600 hover:text-indigo-700"
          >
            {showTopicExplorer ? 'Hide Explorer' : 'Show Explorer'}
            <ChevronDown className={`w-5 h-5 ml-2 transform transition-transform ${
              showTopicExplorer ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        {showTopicExplorer ? (
          <TopicExplorer
            onBack={() => setShowTopicExplorer(false)}
            onTopicSelect={handleTopicSelect}
          />
        ) : (
          <div className="text-center py-8">
            <Compass className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Use the Topic Explorer to find and explore research topics
            </p>
          </div>
        )}
      </div>

      {/* Communities Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Research Communities</h2>
            <p className="text-gray-600 mt-1">Connect with researchers in your field</p>
          </div>
          <button
            onClick={() => setShowCommunities(!showCommunities)}
            className="flex items-center text-indigo-600 hover:text-indigo-700"
          >
            {showCommunities ? 'Hide Communities' : 'Show Communities'}
            <ChevronDown className={`w-5 h-5 ml-2 transform transition-transform ${
              showCommunities ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        {showCommunities && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communities.map(community => (
              <div key={community.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{community.name}</h4>
                  <span className="text-sm text-gray-500">{community.members} members</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{community.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    <Globe className="w-4 h-4 inline mr-1" />
                    {community.platform}
                  </span>
                  <button
                    onClick={() => handleJoinCommunity(community)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Join Community
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resources Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Research Resources</h2>
            <p className="text-gray-600 mt-1">Find and save research materials</p>
          </div>
          <button
            onClick={() => setShowResources(!showResources)}
            className="flex items-center text-indigo-600 hover:text-indigo-700"
          >
            {showResources ? 'Hide Resources' : 'Show Resources'}
            <ChevronDown className={`w-5 h-5 ml-2 transform transition-transform ${
              showResources ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        {showResources && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map(resource => (
              <div key={resource.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{resource.title}</h4>
                  <span className="text-sm text-gray-500">{resource.type}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4 inline mr-1" />
                      View Resource
                    </a>
                    <button
                      onClick={() => handleSaveResource(resource)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                  {resource.citations && (
                    <span className="text-sm text-gray-500">
                      {resource.citations} citations
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Phase Completion */}
      {isPhaseComplete() && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Discovery Phase Complete!
                </h3>
                <p className="text-green-700">
                  You've completed all required tasks. Ready to move to the Design Phase?
                </p>
              </div>
            </div>
            <button
              onClick={handleProjectCreation}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Move to Design Phase
            </button>
          </div>
        </div>
      )}
    </div>
  );
}