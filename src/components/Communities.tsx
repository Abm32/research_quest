import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Users,
  MessageCircle,
  Activity,
  ExternalLink,
  Filter,
  Sparkles,
  Globe
} from 'lucide-react';

export function Communities() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPlatform, setSelectedPlatform] = React.useState('');
  const [selectedTopic, setSelectedTopic] = React.useState('');

  const communities = [
    {
      id: '1',
      name: 'Data Science Hub',
      description: 'A community of data scientists sharing knowledge and resources.',
      platform: 'discord',
      member_count: 5234,
      activity_level: 'high',
      topics: ['Machine Learning', 'Data Analysis', 'Python'],
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: '2',
      name: 'Research Methods',
      description: 'Discuss and learn about various research methodologies.',
      platform: 'slack',
      member_count: 3127,
      activity_level: 'medium',
      topics: ['Methodology', 'Statistics', 'Academic Writing'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '3',
      name: 'r/AcademicResearch',
      description: 'Reddit community for academic researchers and students.',
      platform: 'reddit',
      member_count: 12893,
      activity_level: 'high',
      topics: ['Academia', 'Research', 'Collaboration'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = !selectedPlatform || community.platform === selectedPlatform;
    const matchesTopic = !selectedTopic || community.topics.includes(selectedTopic);
    return matchesSearch && matchesPlatform && matchesTopic;
  });

  const allTopics = Array.from(new Set(communities.flatMap(c => c.topics)));

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
            <div className="flex flex-col sm:flex-row gap-4 sm:w-auto w-full">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full sm:w-40 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">All Platforms</option>
                <option value="discord">Discord</option>
                <option value="slack">Slack</option>
                <option value="reddit">Reddit</option>
              </select>
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
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <motion.div
            key={community.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
          >
            <div className={`h-2 bg-gradient-to-r ${community.color}`} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{community.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm
                  ${community.activity_level === 'high' ? 'bg-green-100 text-green-600' :
                    community.activity_level === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'}`}
                >
                  {community.activity_level} activity
                </span>
              </div>
              <p className="text-gray-600 mb-4">{community.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {community.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{community.member_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MessageCircle className="w-4 h-4" />
                    <span>Active</span>
                  </div>
                </div>
                <button className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-300">
                  <span>Join</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm"
        >
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No communities found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPlatform('');
              setSelectedTopic('');
            }}
            className="mt-4 text-indigo-600 hover:text-indigo-700"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  );
}