import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  AlertCircle
} from 'lucide-react';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './auth/AuthContext';
import { searchDiscordCommunities, type DiscordCommunity } from '../api/discord';
import { searchSlackCommunities, type SlackCommunity } from '../api/slack';
import { searchRedditCommunities, type RedditCommunity } from '../api/reddit';

type Platform = 'discord' | 'slack' | 'reddit' | 'custom';

interface Community {
  id: string;
  name: string;
  description: string;
  topics: string[];
  memberCount: number;
  createdBy?: string;
  createdAt?: Timestamp;
  platform: Platform;
  iconUrl?: string;
  url?: string;
  isVerified?: boolean;
}

export default function Communities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | ''>('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    topics: [] as string[],
    newTopic: ''
  });

  const { user } = useAuth();

  const fetchCustomCommunities = async () => {
    try {
      const q = query(
        collection(db, 'communities'),
        where('platform', '==', 'custom'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        platform: 'custom' as const
      })) as Community[];
    } catch (err) {
      console.error('Error fetching custom communities:', err);
      return [];
    }
  };

  const fetchAllCommunities = async () => {
    setLoading(true);
    setError('');
    try {
      const customCommunities = await fetchCustomCommunities();
      let platformCommunities: Community[] = [];

      if (searchQuery) {
        try {
          const [discordResults, slackResults, redditResults] = await Promise.all([
            searchDiscordCommunities(searchQuery).catch(() => []),
            searchSlackCommunities(searchQuery).catch(() => []),
            searchRedditCommunities(searchQuery).catch(() => [])
          ]);

          platformCommunities = [
            ...discordResults.map(c => ({
              id: c.id,
              name: c.name,
              description: c.description,
              memberCount: c.memberCount,
              platform: 'discord' as const,
              topics: [],
              iconUrl: c.iconUrl,
              isVerified: c.isVerified
            })),
            ...slackResults.map(c => ({
              id: c.id,
              name: c.name,
              description: c.description,
              memberCount: c.memberCount,
              platform: 'slack' as const,
              topics: [],
              iconUrl: c.iconUrl
            })),
            ...redditResults.map(c => ({
              id: c.id,
              name: c.name,
              description: c.description,
              memberCount: c.memberCount,
              platform: 'reddit' as const,
              topics: [],
              iconUrl: c.iconUrl,
              url: c.url
            }))
          ];
        } catch (err) {
          console.error('Error fetching platform communities:', err);
        }
      }

      setCommunities([...customCommunities, ...platformCommunities]);
    } catch (err) {
      setError('Failed to fetch communities');
      console.error('Error fetching all communities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCommunities();
  }, [searchQuery]);

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'communities'), {
        name: newCommunity.name,
        description: newCommunity.description,
        topics: newCommunity.topics,
        memberCount: 1,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        platform: 'custom'
      });

      setShowCreateModal(false);
      setNewCommunity({ name: '', description: '', topics: [], newTopic: '' });
      fetchAllCommunities();
    } catch (err) {
      setError('Failed to create community');
      console.error('Error creating community:', err);
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

  const filteredCommunities = communities.filter(community => {
    const matchesPlatform = !selectedPlatform || community.platform === selectedPlatform;
    const matchesTopic = !selectedTopic || community.topics.includes(selectedTopic);
    const matchesSearch = !searchQuery || 
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesTopic && matchesSearch;
  });

  const sortedCommunities = [...filteredCommunities].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.memberCount - a.memberCount;
    }
    return (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);
  });

  const allTopics = Array.from(new Set(communities.flatMap(c => c.topics)));

  const getPlatformColor = (platform: Platform) => {
    switch (platform) {
      case 'discord':
        return 'from-indigo-500 to-purple-500';
      case 'slack':
        return 'from-green-500 to-emerald-500';
      case 'reddit':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research Communities</h1>
          <p className="text-gray-600">Connect and collaborate with researchers worldwide</p>
        </div>
        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Community</span>
          </button>
        )}
      </motion.div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search communities..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as Platform | '')}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Topics</option>
                  {allTopics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              )}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Communities Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCommunities.map((community) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${getPlatformColor(community.platform)}`} />
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  {community.iconUrl ? (
                    <img src={community.iconUrl} alt="" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{community.name}</h3>
                    <span className="text-sm text-gray-500 capitalize">{community.platform}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{community.description}</p>
                {community.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {community.topics.map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500">{community.memberCount.toLocaleString()}</span>
                    </div>
                    {community.isVerified && (
                      <span className="text-blue-600 text-sm">Verified</span>
                    )}
                  </div>
                  {community.url ? (
                    <a
                      href={community.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Join
                    </a>
                  ) : (
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Join
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Community Modal */}
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