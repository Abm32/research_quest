import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Newspaper,
  Lightbulb,
  TrendingUp,
  BookOpen,
  Globe,
  Brain,
  Share2,
  ArrowLeft,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Users,
  CheckCircle,
  ListTodo
} from 'lucide-react';
import axios from 'axios';
import { auth } from '../../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  saveTopicSelection,
  saveGeneratedTasks,
  saveUserInteraction,
  getUserTopicHistory,
  type ResearchTask,
  type TopicData
} from '../../services/topicService';
import type { Topic } from '../../types';

interface TopicExplorerProps {
  onBack: () => void;
  onTopicSelect: (topic: Topic) => void;
}

export function TopicExplorer({ onBack, onTopicSelect }: TopicExplorerProps) {
  const [user, authLoading, authError] = useAuthState(auth);
  const [activeSection, setActiveSection] = useState<'trending' | 'news' | 'discover'>('trending');
  const [newsData, setNewsData] = useState<any[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Topic[]>([
    {
      id: 'rec1',
      title: 'Impact of AI on Healthcare',
      description: 'Research opportunities in AI-driven medical diagnosis and treatment.',
      relevance: 95,
      keywords: ['AI', 'Healthcare', 'Medical Technology'],
      category: 'technology',
      researchers: ['Dr. Sarah Johnson', 'Prof. Michael Chen'],
      discussions: ['Latest breakthroughs', 'Industry applications'],
      trending: true,
      papers: 2000,
      citations: 40000,
      color: 'blue',
      researchInterests: ['AI', 'Healthcare'],
      researchGoals: ['Improving medical diagnosis', 'Enhancing treatment planning'],
      userInteractions: []
    },
    {
      id: 'rec2',
      title: 'Sustainable Energy Solutions',
      description: 'Exploring renewable energy technologies and their implementation.',
      relevance: 88,
      keywords: ['Sustainability', 'Energy', 'Climate Change'],
      category: 'environmental',
      researchers: ['Dr. Emily Brown', 'Prof. David Wilson'],
      discussions: ['Policy implications', 'Technology adoption'],
      trending: true,
      papers: 2500,
      citations: 45000,
      color: 'green',
      researchInterests: ['Renewable Energy', 'Sustainability'],
      researchGoals: ['Developing energy solutions', 'Promoting sustainability'],
      userInteractions: []
    },
    {
      id: 'rec3',
      title: 'Quantum Machine Learning',
      description: 'Exploring the intersection of quantum computing and machine learning algorithms.',
      relevance: 82,
      keywords: ['Quantum Computing', 'Machine Learning', 'Algorithm Design'],
      category: 'technology',
      researchers: ['Dr. James Smith', 'Prof. Lisa Chen'],
      discussions: ['Clinical applications', 'Ethical considerations'],
      trending: false,
      papers: 1500,
      citations: 25000,
      color: 'purple',
      researchInterests: ['Quantum Computing', 'Machine Learning'],
      researchGoals: ['Advancing quantum ML', 'Developing new algorithms'],
      userInteractions: []
    },
    {
      id: 'rec4',
      title: 'Neurotechnology Advances',
      description: 'Latest developments in brain-computer interfaces and neural engineering.',
      relevance: 78,
      keywords: ['Neuroscience', 'BCI', 'Neural Networks'],
      category: 'neuroscience',
      researchers: ['Dr. Robert Wilson', 'Prof. Maria Garcia'],
      discussions: ['Clinical trials', 'Ethical implications'],
      trending: false,
      papers: 1800,
      citations: 30000,
      color: 'indigo',
      researchInterests: ['Neuroscience', 'BCI'],
      researchGoals: ['Advancing neurotechnology', 'Improving BCI systems'],
      userInteractions: []
    }
  ]);
  const [activeDiscoverySection, setActiveDiscoverySection] = useState<'interests' | 'global' | 'collaboration' | null>(null);
  const [topicTasks, setTopicTasks] = useState<{ [key: string]: ResearchTask[] }>({});
  const [selectedTopicTasks, setSelectedTopicTasks] = useState<ResearchTask[]>([]);
  const [isConfirmingTopic, setIsConfirmingTopic] = useState(false);
  const [selectedTopicData, setSelectedTopicData] = useState<TopicData | null>(null);

  useEffect(() => {
    // Load initial data regardless of authentication
    fetchTopicsData();
  }, []);

  const fetchTopicsData = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const mockTrending: Topic[] = [
        {
          id: 'ai-ethics',
          title: 'AI Ethics and Governance',
          description: 'Exploring ethical implications and governance frameworks for artificial intelligence.',
          category: 'Technology',
          relevance: 95,
          keywords: ['Machine Learning', 'Policy Making', 'Social Impact'],
          researchers: ['Dr. Sarah Johnson', 'Prof. Michael Chen'],
          discussions: ['Latest breakthroughs', 'Industry applications'],
          trending: true,
          papers: 2500,
          citations: 45000,
          color: 'blue',
          researchInterests: ['AI', 'Ethics', 'Governance'],
          researchGoals: ['Understanding AI ethics', 'Developing governance frameworks'],
          userInteractions: []
        },
        {
          id: 'quantum-computing',
          title: 'Quantum Computing Applications',
          description: 'Investigating practical applications of quantum computing in various fields.',
          category: 'Physics',
          relevance: 88,
          keywords: ['Quantum Mechanics', 'Computer Science', 'Cryptography'],
          researchers: ['Dr. Emily Brown', 'Prof. David Wilson'],
          discussions: ['Policy implications', 'Technology adoption'],
          trending: true,
          papers: 1800,
          citations: 35000,
          color: 'green',
          researchInterests: ['Quantum Computing', 'Cryptography'],
          researchGoals: ['Exploring quantum applications', 'Developing quantum algorithms'],
          userInteractions: []
        },
        {
          id: 'climate-solutions',
          title: 'Climate Change Solutions',
          description: 'Research on innovative solutions to address climate change challenges.',
          category: 'Environmental Science',
          relevance: 92,
          keywords: ['Renewable Energy', 'Sustainability', 'Environmental Policy'],
          researchers: ['Dr. James Smith', 'Prof. Lisa Chen'],
          discussions: ['Clinical applications', 'Ethical considerations'],
          trending: true,
          papers: 3000,
          citations: 55000,
          color: 'purple',
          researchInterests: ['Climate Change', 'Sustainability'],
          researchGoals: ['Developing climate solutions', 'Promoting sustainability'],
          userInteractions: []
        },
        {
          id: 'brain-computer',
          title: 'Brain-Computer Interfaces',
          description: 'Developing direct communication pathways between the brain and external devices.',
          category: 'Neuroscience',
          relevance: 90,
          keywords: ['Neural Engineering', 'Human-Computer Interaction', 'Medical Technology'],
          researchers: ['Dr. Robert Wilson', 'Prof. Maria Garcia'],
          discussions: ['Clinical trials', 'Ethical implications'],
          trending: true,
          papers: 1500,
          citations: 28000,
          color: 'indigo',
          researchInterests: ['BCI', 'Neuroscience'],
          researchGoals: ['Advancing BCI technology', 'Improving human-computer interaction'],
          userInteractions: []
        }
      ];

      setTrendingTopics(mockTrending);

      // Only fetch news if we have an API key
      if (import.meta.env.VITE_NEWS_API_KEY) {
        try {
          const newsResponse = await axios.get(
            `https://newsapi.org/v2/everything?q=research AND (science OR technology OR innovation)&sortBy=publishedAt&pageSize=10&language=en&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
          );

          const formattedNews = newsResponse.data.articles.map((article: any) => ({
            id: article.url,
            title: article.title,
            description: article.description,
            url: article.url,
            source: article.source.name,
            publishedAt: new Date(article.publishedAt),
            imageUrl: article.urlToImage
          }));

          setNewsData(formattedNews);
        } catch (newsError) {
          console.error('Error fetching news:', newsError);
          // Don't set error state for news fetch failure
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoadError('Failed to load topic data. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleTopicInterest = async (topic: Topic, interested: boolean) => {
    if (!user) return;

    try {
      // Update user interests
      if (interested) {
        setUserInterests(prev => [...prev, topic.id]);
      } else {
        setUserInterests(prev => prev.filter(t => t !== topic.id));
      }

      // Update topic with user interaction
      const updatedTopic: Topic = {
        ...topic,
        userInteractions: [
          ...(topic.userInteractions || []),
          {
            type: interested ? 'like' : 'view',
            timestamp: new Date()
          }
        ]
      };

      // Save topic selection
      await saveTopicSelection(user.uid, updatedTopic);
    } catch (error) {
      console.error('Error handling topic interest:', error);
      // Handle error appropriately
    }
  };

  const generateRecommendations = async (topic: string, interested: boolean) => {
    try {
      setIsLoading(true);
      const API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct";
      const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

      const prompt = interested
        ? `Based on the user's interest in "${topic}", suggest 4 highly relevant research topics. For each topic, provide:
           1. A title
           2. A relevance score (as a percentage)
           3. A brief description
           4. 3-4 relevant keywords
           Format the response as a JSON array.`
        : `Suggest 4 diverse research topics for a beginner researcher. For each topic, provide:
           1. A title
           2. A relevance score (as a percentage)
           3. A brief description
           4. 3-4 relevant keywords
           Format the response as a JSON array.`;

      const { data } = await axios.post(
        API_URL,
        { 
          inputs: prompt
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      try {
        // Try to parse the AI response as JSON
        const aiRecommendations = JSON.parse(data[0]?.generated_text);
        
        // Format the recommendations to match our expected structure
        const formattedRecommendations = aiRecommendations.map((rec: any) => ({
          id: crypto.randomUUID(),
          title: rec.title,
          relevance: `${rec.relevance}% match`,
          description: rec.description,
          keywords: rec.keywords
        }));

        setRecommendations(formattedRecommendations);
      } catch (parseError) {
        console.error('Error parsing AI recommendations:', parseError);
        // Fallback to default recommendations if parsing fails
        setRecommendations([
          {
            id: 'rec1',
            title: 'Impact of AI on Healthcare',
            relevance: '95% match',
            description: 'Research opportunities in AI-driven medical diagnosis and treatment.',
            keywords: ['AI', 'Healthcare', 'Medical Technology']
          },
          {
            id: 'rec2',
            title: 'Sustainable Energy Solutions',
            relevance: '88% match',
            description: 'Exploring renewable energy technologies and their implementation.',
            keywords: ['Sustainability', 'Energy', 'Climate Change']
          },
          {
            id: 'rec3',
            title: 'Quantum Machine Learning',
            relevance: '82% match',
            description: 'Exploring the intersection of quantum computing and machine learning algorithms.',
            keywords: ['Quantum Computing', 'Machine Learning', 'Algorithm Design']
          },
          {
            id: 'rec4',
            title: 'Neurotechnology Advances',
            relevance: '78% match',
            description: 'Latest developments in brain-computer interfaces and neural engineering.',
            keywords: ['Neuroscience', 'BCI', 'Neural Networks']
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      // Fallback to default recommendations if API call fails
      setRecommendations([
        {
          id: 'rec1',
          title: 'Impact of AI on Healthcare',
          relevance: '95% match',
          description: 'Research opportunities in AI-driven medical diagnosis and treatment.',
          keywords: ['AI', 'Healthcare', 'Medical Technology']
        },
        {
          id: 'rec2',
          title: 'Sustainable Energy Solutions',
          relevance: '88% match',
          description: 'Exploring renewable energy technologies and their implementation.',
          keywords: ['Sustainability', 'Energy', 'Climate Change']
        },
        {
          id: 'rec3',
          title: 'Quantum Machine Learning',
          relevance: '82% match',
          description: 'Exploring the intersection of quantum computing and machine learning algorithms.',
          keywords: ['Quantum Computing', 'Machine Learning', 'Algorithm Design']
        },
        {
          id: 'rec4',
          title: 'Neurotechnology Advances',
          relevance: '78% match',
          description: 'Latest developments in brain-computer interfaces and neural engineering.',
          keywords: ['Neuroscience', 'BCI', 'Neural Networks']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTasksForTopic = async (topic: string, isSelected: boolean = false) => {
    try {
      setIsLoading(true);
      const API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct";
      const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

      const prompt = `Generate 3 research tasks for the topic "${topic}". For each task provide:
        1. A clear title
        2. A detailed description
        3. Difficulty level (must be exactly one of: Beginner, Intermediate, or Advanced)
        4. Estimated time to complete
        5. List of helpful resources
        Format the response as a JSON array.`;

      const { data } = await axios.post(
        API_URL,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      try {
        const parsedTasks = JSON.parse(data[0]?.generated_text);
        const tasks: ResearchTask[] = parsedTasks.map((task: any) => ({
          id: crypto.randomUUID(),
          title: task.title,
          description: task.description,
          difficulty: task.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
          estimatedTime: task.estimatedTime,
          resources: task.resources,
          completed: false
        }));

        // Save tasks to Firebase only if user is authenticated
        if (user && isSelected && selectedTopicData) {
          await saveGeneratedTasks(user.uid, selectedTopicData.id, tasks);
        }

        if (isSelected) {
          setSelectedTopicTasks(tasks);
        } else {
          setTopicTasks(prev => ({
            ...prev,
            [topic]: tasks
          }));
        }
      } catch (parseError) {
        console.error('Error parsing AI tasks:', parseError);
        // Use fallback tasks
        const fallbackTasks: ResearchTask[] = [
          {
            id: crypto.randomUUID(),
            title: 'Literature Review',
            description: 'Conduct a comprehensive literature review on the topic.',
            difficulty: 'Beginner',
            estimatedTime: '2-3 weeks',
            resources: ['Google Scholar', 'Research Gate', 'Academic Journals'],
            completed: false
          },
          {
            id: crypto.randomUUID(),
            title: 'Research Proposal',
            description: 'Develop a detailed research proposal.',
            difficulty: 'Intermediate',
            estimatedTime: '3-4 weeks',
            resources: ['Research Methodology Books', 'Sample Proposals'],
            completed: false
          },
          {
            id: crypto.randomUUID(),
            title: 'Pilot Study',
            description: 'Design and conduct a small pilot study.',
            difficulty: 'Advanced',
            estimatedTime: '4-6 weeks',
            resources: ['Statistical Tools', 'Data Collection Methods'],
            completed: false
          }
        ];

        if (isSelected) {
          setSelectedTopicTasks(fallbackTasks);
        } else {
          setTopicTasks(prev => ({
            ...prev,
            [topic]: fallbackTasks
          }));
        }
      }
    } catch (error) {
      console.error('Error generating tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelect = async (topic: Topic) => {
    if (!user) return;

    try {
      // Update topic with user interaction
      const updatedTopic: Topic = {
        ...topic,
        userInteractions: [
          ...(topic.userInteractions || []),
          {
            type: 'select',
            timestamp: new Date()
          }
        ]
      };

      // Save topic selection
      await saveTopicSelection(user.uid, updatedTopic);

      // Call the parent's onTopicSelect handler
      onTopicSelect(updatedTopic);
    } catch (error) {
      console.error('Error selecting topic:', error);
      // Handle error appropriately
    }
  };

  const handleConfirmTopic = async () => {
    if (!selectedTopicData) return;

    try {
      // Save to Firebase only if user is authenticated
      if (user) {
        const topicId = await saveTopicSelection(user.uid, {
          ...selectedTopicData,
          tasks: selectedTopicTasks,
          userInteractions: {
            ...selectedTopicData.userInteractions,
            selectedAt: new Date()
          }
        });

        await saveUserInteraction(user.uid, topicId, {
          type: 'select',
          timestamp: new Date()
        });
      }

      onTopicSelect(selectedTopicData);
      setIsConfirmingTopic(false);
    } catch (error) {
      console.error('Error confirming topic:', error);
    }
  };

  const renderTasks = (tasks: ResearchTask[]) => (
    <div className="mt-4 space-y-3">
      <h5 className="text-sm font-medium text-gray-900">Suggested Research Tasks:</h5>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-gray-50 p-3 rounded-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <h6 className="text-sm font-medium text-gray-900">{task.title}</h6>
              <p className="text-xs text-gray-600 mt-1">{task.description}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              task.difficulty === 'Beginner' ? 'bg-green-100 text-green-600' :
              task.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {task.difficulty}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>⏱️ {task.estimatedTime}</span>
            <button
              className="text-indigo-600 hover:text-indigo-700 font-medium"
              onClick={() => {/* Handle task details view */}}
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Add confirmation modal JSX
  const renderConfirmationModal = () => {
    if (!isConfirmingTopic || !selectedTopicData) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-white rounded-xl p-6 max-w-lg w-full">
          <h3 className="text-xl font-semibold mb-4">Confirm Topic Selection</h3>
          <div className="mb-4">
            <h4 className="font-medium">{selectedTopicData.title}</h4>
            <p className="text-gray-600 mt-2">{selectedTopicData.description}</p>
          </div>
          {selectedTopicTasks.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">Initial Research Tasks:</h5>
              {renderTasks(selectedTopicTasks)}
            </div>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setIsConfirmingTopic(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmTopic}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-4">{loadError}</p>
        <button
          onClick={() => fetchTopicsData()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Discovery</span>
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSection('trending')}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeSection === 'trending'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveSection('news')}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeSection === 'news'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Latest News
          </button>
          <button
            onClick={() => setActiveSection('discover')}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeSection === 'discover'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Discover
          </button>
        </div>
      </div>

      {activeSection === 'trending' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Trending Research Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              // Loading skeleton for trending topics
              Array(4).fill(null).map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm animate-pulse"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="h-6 w-48 bg-gray-200 rounded"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array(3).fill(null).map((_, i) => (
                      <div key={i} className="h-6 w-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              trendingTopics.map((topic) => (
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
                      {topic.trend}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(topic.relatedTopics || []).map((related: string) => (
                      <span
                        key={related}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {related}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="space-x-2">
                      <button
                        onClick={() => handleTopicInterest(topic, true)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <ThumbsUp className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleTopicInterest(topic, false)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <ThumbsDown className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleTopicSelect(topic)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Explore Topic
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {activeSection === 'news' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Research News</h2>
          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              // Loading skeleton for news
              Array(3).fill(null).map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm animate-pulse"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : newsData.length > 0 ? (
              newsData.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start space-x-4">
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{article.source}</span>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          <span>Read More</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No news articles available at the moment.</p>
                <p className="text-sm text-gray-500 mt-2">Please check back later for updates.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'discover' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Discover Research Areas</h2>
          
          {!activeDiscoverySection ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                onClick={async () => {
                  setActiveDiscoverySection('interests');
                  // Generate initial recommendations if none exist
                  if (recommendations.length === 0) {
                    await generateRecommendations('', false);
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl text-white text-left"
              >
                <Brain className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Based on Your Interests</h3>
                <p className="text-sm opacity-90">
                  Discover research topics tailored to your interests and previous interactions.
                </p>
              </motion.button>

              <motion.button
                onClick={() => setActiveDiscoverySection('global')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl text-white text-left"
              >
                <Globe className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Global Research Trends</h3>
                <p className="text-sm opacity-90">
                  Explore what researchers worldwide are currently investigating.
                </p>
              </motion.button>

              <motion.button
                onClick={() => setActiveDiscoverySection('collaboration')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl text-white text-left"
              >
                <Share2 className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Collaboration Opportunities</h3>
                <p className="text-sm opacity-90">
                  Find potential research partners and ongoing projects to join.
                </p>
              </motion.button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveDiscoverySection(null)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Discovery Options</span>
                </button>
              </div>

              {activeDiscoverySection === 'interests' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900">Topics Based on Your Interests</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendations.map((rec) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{rec.title}</h4>
                          <span className="text-sm text-indigo-600 font-medium">{rec.relevance}</span>
                        </div>
                        <p className="text-gray-600 mb-4">{rec.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {rec.keywords.map((keyword: string) => (
                            <span
                              key={keyword}
                              className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                        {topicTasks[rec.title] && renderTasks(topicTasks[rec.title])}
                        {!topicTasks[rec.title] && (
                          <button
                            onClick={() => generateTasksForTopic(rec.title)}
                            className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                          >
                            <ListTodo className="w-4 h-4" />
                            <span>Generate Research Tasks</span>
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeDiscoverySection === 'global' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900">Global Research Trends</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trendingTopics.map((topic) => (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{topic.title}</h4>
                          <span className="text-sm text-green-600 font-medium">{topic.trend}</span>
                        </div>
                        <p className="text-gray-600 mb-4">{topic.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {(topic.relatedTopics || []).map((related: string) => (
                            <span
                              key={related}
                              className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                            >
                              {related}
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
                </motion.div>
              )}

              {activeDiscoverySection === 'collaboration' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900">Research Collaboration Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        id: 'collab1',
                        title: 'AI Ethics Research Group',
                        institution: 'Global Tech University',
                        members: 12,
                        openPositions: 3,
                        description: 'Join our research group focusing on ethical implications of AI development.',
                        requirements: ['Machine Learning', 'Ethics', 'Policy Making']
                      },
                      {
                        id: 'collab2',
                        title: 'Climate Change Solutions',
                        institution: 'Environmental Research Institute',
                        members: 8,
                        openPositions: 2,
                        description: 'Collaborative research on innovative climate change solutions.',
                        requirements: ['Environmental Science', 'Data Analysis', 'Sustainability']
                      }
                    ].map((opportunity) => (
                      <motion.div
                        key={opportunity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{opportunity.title}</h4>
                            <p className="text-sm text-gray-600">{opportunity.institution}</p>
                          </div>
                          <span className="text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                            {opportunity.openPositions} open positions
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{opportunity.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                          <Users className="w-4 h-4" />
                          <span>{opportunity.members} members</span>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Required Expertise:</h5>
                          <div className="flex flex-wrap gap-2">
                            {opportunity.requirements.map((req) => (
                              <span
                                key={req}
                                className="px-2 py-1 bg-orange-50 text-orange-600 rounded-full text-sm"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                          onClick={() => {
                            // Handle collaboration request
                            alert('Collaboration request feature coming soon!');
                          }}
                        >
                          Request to Join
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}
      {renderConfirmationModal()}
    </div>
  );
} 