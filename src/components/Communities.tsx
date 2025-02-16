import React from 'react';
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
  Loader2
} from 'lucide-react';
import { useCommunitySearch, type Platform } from '../hooks/useCommunitySearch';

export function Communities() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPlatform, setSelectedPlatform] = React.useState<Platform | ''>('');
  const [selectedTopic, setSelectedTopic] = React.useState('');
  const [sortBy, setSortBy] = React.useState('popular');

  const platforms = React.useMemo(() => 
    selectedPlatform ? [selectedPlatform] : ['discord', 'slack', 'reddit'] as Platform[],
    [selectedPlatform]
  );

  const { communities, loading, error } = useCommunitySearch(searchQuery, platforms);

  const allTopics = React.useMemo(() => 
    Array.from(new Set(communities.flatMap(c => 
      'topics' in c ? c.topics : []
    ))),
    [communities]
  );

  const sortedCommunities = React.useMemo(() => {
    return [...communities].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.memberCount || 0) - (a.memberCount || 0);
        case 'trending':
          return ('trending' in b ? (b.trending ? 1 : 0) : 0) - ('trending' in a ? (a.trending ? 1 : 0) : 0);
        default:
          return 0;
      }
    });
  }, [communities, sortBy]);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'discord':
        return 'from-indigo-500 to-purple-500';
      case 'slack':
        return 'from-green-500 to-emerald-500';
      case 'reddit':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Research Communities</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with researchers across different platforms. Join discussions,
          share insights, and collaborate on projects.
        </p>
      </motion.div>

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
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:w-auto w-full">
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as Platform | '')}
                  className="w-full sm:w-40 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">All Platforms</option>
                  <option value="discord">Discord</option>
                  <option value="slack">Slack</option>
                  <option value="reddit">Reddit</option>
                </select>
                {allTopics.length > 0 && (
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="">All Topics</option>
                    {allTopics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Sort by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'popular', label: 'Most Popular', icon: Users },
                  { value: 'trending', label: 'Trending', icon: TrendingUp }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors
                      ${sortBy === option.value
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <option.icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-indigo-600 hover:text-indigo-700"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCommunities.map((community) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="flex flex-col bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${getPlatformColor(community.platform)}`} />
              <div className="flex flex-col flex-grow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold text-gray-900 truncate">
                        {community.name}
                      </h3>
                      {'trending' in community && community.trending && (
                        <span className="flex-shrink-0 flex items-center space-x-1 px-2 py-1 bg-rose-100 text-rose-600 rounded-full text-xs">
                          <TrendingUp className="w-3 h-3" />
                          <span>Trending</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{community.description}</p>
                {'topics' in community && community.topics && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {community.topics.map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                        onClick={() => setSelectedTopic(topic)}
                      >
                        <Hash className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{topic}</span>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 mt-auto border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>{(community.memberCount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MessageCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Active</span>
                    </div>
                  </div>
                  {'url' in community ? (
                    <a
                      href={community.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <span>Join</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <button className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-300">
                      <span>Join</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && !error && sortedCommunities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm"
        >
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No communities found matching your criteria.</p>
          <div className="mt-4 space-x-4">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-indigo-600 hover:text-indigo-700"
              >
                Clear search
              </button>
            )}
            {selectedPlatform && (
              <button
                onClick={() => setSelectedPlatform('')}
                className="text-indigo-600 hover:text-indigo-700"
              >
                Show all platforms
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}