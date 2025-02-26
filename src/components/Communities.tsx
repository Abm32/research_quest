import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search,
  Users,
  MessageCircle,
  ExternalLink,
  Filter,
  Sparkles,
  TrendingUp,
  Star,
  Hash,
  Loader2,
  Plus,
  AlertCircle,
  Bot,
  Globe,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { communityService } from '../services/communityService';
import { searchDiscordCommunities } from '../api/discord';
import { searchSlackCommunities } from '../api/slack';
import { searchRedditCommunities } from '../api/reddit';
import type { Community } from '../types';
import axios from 'axios';

function Communities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAIResponse] = useState<string | null>(null);
  const [customCommunities, setCustomCommunities] = useState<Community[]>([]);
  const [platformCommunities, setPlatformCommunities] = useState<Community[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    topics: [] as string[],
    newTopic: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setCustomCommunities([]);
      setPlatformCommunities([]);
      setLoading(false);
      return;
    }

    const fetchCustomCommunities = async () => {
      try {
        setError('');
        const fetchedCommunities = await communityService.fetchCommunities('');
        setCustomCommunities(fetchedCommunities);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Failed to fetch communities');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomCommunities();
  }, [user]);

  useEffect(() => {
    const searchPlatformCommunities = async () => {
      if (!searchQuery || selectedPlatform === 'custom') {
        setPlatformCommunities([]);
        return;
      }

      setLoading(true);
      try {
        let results: Community[] = [];
        
        const platformsToSearch = selectedPlatform && selectedPlatform !== 'custom' 
          ? [selectedPlatform] 
          : ['discord', 'slack', 'reddit'];
        
        await Promise.all(platformsToSearch.map(async (platform) => {
          let platformResults: Community[] = [];
          
          switch (platform) {
            case 'discord':
              const discordResults = await searchDiscordCommunities(searchQuery);
              platformResults = discordResults.map(c => ({
                ...c,
                platform: 'discord',
                topics: [],
                created_by: '',
                members: [],
                activity_level: 'medium',
                member_count: c.memberCount
              }));
              break;
            
            case 'slack':
              const slackResults = await searchSlackCommunities(searchQuery);
              platformResults = slackResults.map(c => ({
                ...c,
                platform: 'slack',
                topics: [],
                created_by: '',
                members: [],
                activity_level: 'medium',
                member_count: c.memberCount
              }));
              break;
            
            case 'reddit':
              const redditResults = await searchRedditCommunities(searchQuery);
              platformResults = redditResults.map(c => ({
                ...c,
                platform: 'reddit',
                topics: [],
                created_by: '',
                members: [],
                activity_level: 'medium',
                member_count: c.memberCount
              }));
              break;
          }
          
          results = [...results, ...platformResults];
        }));

        setPlatformCommunities(results);
      } catch (err) {
        console.error(`Error searching communities:`, err);
        setError(`Failed to search communities`);
      } finally {
        setLoading(false);
      }
    };

    if (!isAIMode) {
      searchPlatformCommunities();
    }
  }, [selectedPlatform, searchQuery, isAIMode]);

  useEffect(() => {
    if (!isAIMode) {
      let filteredCommunities: Community[] = [];

      if (selectedPlatform === 'custom') {
        filteredCommunities = [...customCommunities];
      } else if (selectedPlatform) {
        filteredCommunities = [...platformCommunities];
      } else {
        filteredCommunities = [...customCommunities, ...platformCommunities];
      }

      if (searchQuery) {
        filteredCommunities = filteredCommunities.filter(community =>
          community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.topics.some(topic => 
            topic.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }

      if (selectedTopic) {
        filteredCommunities = filteredCommunities.filter(
          community => community.topics.includes(selectedTopic)
        );
      }

      filteredCommunities.sort((a, b) => {
        if (sortBy === 'popular') {
          return b.member_count - a.member_count;
        }
        return (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);
      });

      setCommunities(filteredCommunities);
    }
  }, [searchQuery, selectedPlatform, selectedTopic, sortBy, isAIMode, customCommunities, platformCommunities]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (isAIMode) {
      handleAISearch();
    }
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim() || !isAIMode) return;

    setIsSearching(true);
    setAIResponse(null);
    try {
      const API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct";
      const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

      const { data } = await axios.post(
        API_URL,
        { 
          inputs: `You are a research community assistant. Help find relevant research communities based on the following query: ${searchQuery}. Analyze the query and suggest relevant communities, topics, and potential collaborations. Format your response in a clear, structured way with sections for:
          1. Relevant Research Areas
          2. Suggested Communities
          3. Potential Collaborations
          4. Additional Resources` 
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = data[0]?.generated_text;
      if (aiResponse) {
        setAIResponse(aiResponse);

        const relevantCommunities = customCommunities.filter(community => 
          aiResponse.toLowerCase().includes(community.name.toLowerCase()) ||
          community.topics.some(topic => 
            aiResponse.toLowerCase().includes(topic.toLowerCase())
          )
        );

        setCommunities(relevantCommunities);
      }
    } catch (err) {
      console.error('Error with AI search:', err);
      setError('AI search failed. Falling back to regular search.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setError('');
      await communityService.createCommunity({
        name: newCommunity.name,
        description: newCommunity.description,
        topics: newCommunity.topics,
        platform: 'custom',
        member_count: 1,
        activity_level: 'low',
        created_by: user.uid,
        members: [user.uid]
      });

      setShowCreateModal(false);
      setNewCommunity({ name: '', description: '', topics: [], newTopic: '' });
      
      const updatedCommunities = await communityService.fetchCommunities('');
      setCustomCommunities(updatedCommunities);
    } catch (err) {
      console.error('Error creating community:', err);
      setError('Failed to create community');
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) return;

    try {
      setError('');
      await communityService.joinCommunity(communityId, user.uid);
      const updatedCommunities = await communityService.fetchCommunities('');
      setCustomCommunities(updatedCommunities);
    } catch (err) {
      console.error('Error joining community:', err);
      setError('Failed to join community');
    }
  };

  const handleAddTopic = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCommunity.newTopic.trim()) {
      setNewCommunity({
        ...newCommunity,
        topics: [...newCommunity.topics, newCommunity.newTopic.trim()],
        newTopic: ''
      });
    }
  };

  const allTopics = Array.from(new Set(customCommunities.flatMap(c => c.topics)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Research Communities</h1>
          <p className="text-gray-600 text-sm sm:text-base">Connect and collaborate with researchers worldwide</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/communities/joined"
            className="flex-1 sm:flex-none text-center px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
          >
            Joined Communities
          </Link>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Community</span>
              <span className="sm:hidden">Create</span>
            </button>
          )}
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center text-sm"
        >
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAIMode ? "Ask AI to find communities..." : "Search communities..."}
                className={`w-full pl-10 pr-12 py-2 border rounded-xl focus:ring-2 focus:border-indigo-500 transition-colors text-sm ${
                  isAIMode 
                    ? 'border-indigo-500 bg-indigo-50 focus:ring-indigo-500' 
                    : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              <button
                onClick={() => setIsAIMode(!isAIMode)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                  isAIMode 
                    ? 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200' 
                    : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Bot className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                  {(selectedPlatform || selectedTopic || sortBy !== 'popular') && (
                    <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                      Active
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'recent')}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-4"
                >
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="">All Platforms</option>
                    <option value="discord">Discord</option>
                    <option value="slack">Slack</option>
                    <option value="reddit">Reddit</option>
                    <option value="custom">Custom</option>
                  </select>

                  {allTopics.length > 0 && (
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="">All Topics</option>
                      {allTopics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {isSearching && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      )}

      {isAIMode && aiResponse && !isSearching && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Research Assistant Suggestions</h3>
          <div className="prose prose-indigo max-w-none">
            <div className="whitespace-pre-wrap text-gray-600 text-sm">{aiResponse}</div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {communities.map((community) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {community.platform === 'discord' ? (
                      <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Discord" className="w-6 h-6" />
                    ) : community.platform === 'slack' ? (
                      <img src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" alt="Slack" className="w-6 h-6" />
                    ) : community.platform === 'reddit' ? (
                      <img src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png" alt="Reddit" className="w-6 h-6" />
                    ) : (
                      <Globe className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{community.name}</h3>
                    <span className="text-sm text-gray-500 capitalize">{community.platform}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">{community.description}</p>
                {community.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {community.topics.slice(0, 2).map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs"
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {topic}
                      </span>
                    ))}
                    {community.topics.length > 2 && (
                      <span className="text-xs text-gray-500">+{community.topics.length - 2} more</span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{community.member_count}</span>
                  </div>
                  {community.platform === 'custom' ? (
                    community.members?.includes(user?.uid || '') ? (
                      <Link
                        to={`/communities/${community.id}/chat`}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Chat
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleJoinCommunity(community.id)}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Join
                      </button>
                    )
                  ) : (
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-1"
                    >
                      <span>Join</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-4">Create Community</h2>
            <form onSubmit={handleCreateCommunity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Community Name
                </label>
                <input
                  type="text"
                  required
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topics (Press Enter to add)
                </label>
                <input
                  type="text"
                  value={newCommunity.newTopic}
                  onChange={(e) => setNewCommunity({ ...newCommunity, newTopic: e.target.value })}
                  onKeyDown={handleAddTopic}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {newCommunity.topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => setNewCommunity({
                          ...newCommunity,
                          topics: newCommunity.topics.filter(t => t !== topic)
                        })}
                        className="ml-2 text-indigo-400 hover:text-indigo-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Community
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Communities;