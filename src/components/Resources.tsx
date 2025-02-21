import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  FileText,
  Database,
  Book,
  Download,
  Share2,
  Bot,
  Loader2,
  Filter,
  Star,
  Plus,
  Grid,
  List,
  ExternalLink,
  Upload,
  Tag,
  Code,
  BookTemplate as FileTemplate,
  BookOpen,
  Globe,
  AlertCircle
} from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { resourceService } from '../services/resourceService';
import { ResearchAssistant } from './AIChat/ResearchAssistant';
import { Timestamp } from 'firebase/firestore';
import type { Resource } from '../types';

const getResourceIcon = (type: Resource['type']) => {
  switch (type) {
    case 'paper':
      return FileText;
    case 'dataset':
      return Database;
    case 'tool':
      return Code;
    case 'template':
      return FileTemplate;
    case 'guide':
      return BookOpen;
    case 'external':
      return Globe;
    default:
      return Book;
  }
};

export default function Resources() {
  const { user } = useAuth();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'downloads' | 'rating'>('downloads');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch resources when search parameters change
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        let results: Resource[] = [];

        if (isAIMode && debouncedSearchQuery) {
          // Search across all platforms when in AI mode
          results = await resourceService.searchAllPlatforms(debouncedSearchQuery);
        } else {
          // Regular search using local and API resources
          const [localResults, apiResults] = await Promise.all([
            resourceService.searchResources({
              query: debouncedSearchQuery,
              type: selectedType,
              tags: selectedTags,
              sortBy,
              limit: 20
            }),
            debouncedSearchQuery ? resourceService.searchAllPlatforms(debouncedSearchQuery) : Promise.resolve([])
          ]);

          results = [...localResults, ...apiResults];
        }

        // Sort results
        results.sort((a, b) => {
          switch (sortBy) {
            case 'date':
              return b.createdAt.seconds - a.createdAt.seconds;
            case 'downloads':
              return b.downloadCount - a.downloadCount;
            case 'rating':
              return b.rating - a.rating;
            default:
              return 0;
          }
        });

        setResources(results);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to fetch resources. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [debouncedSearchQuery, selectedType, selectedTags, sortBy, isAIMode]);

  const handleDownload = async (resourceId: string) => {
    try {
      await resourceService.incrementDownload(resourceId);
      // Handle actual download based on resource type
    } catch (err) {
      console.error('Error downloading resource:', err);
    }
  };

  const handleShare = async (resource: Resource) => {
    try {
      await navigator.share({
        title: resource.title,
        text: resource.description,
        url: resource.url
      });
    } catch (err) {
      console.error('Error sharing resource:', err);
    }
  };

  const ResourceCard = ({ resource }: { resource: Resource }) => {
    const Icon = getResourceIcon(resource.type);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ${
          view === 'list' ? 'flex items-start space-x-4' : ''
        }`}
      >
        <div className="p-6">
          <div className="flex items-start space-x-3 mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Icon className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{resource.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{resource.author}</span>
                <span>•</span>
                <span>{resource.source}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-600">
                <Download className="w-4 h-4" />
                <span>{resource.downloadCount}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Star className="w-4 h-4" />
                <span>{resource.rating.toFixed(1)}</span>
                <span>({resource.reviewCount})</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleShare(resource)}
                className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {resource.url ? (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <span>View</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button
                  onClick={() => handleDownload(resource.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research Resources</h1>
          <p className="text-gray-600">Discover and share valuable research materials</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Resource</span>
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg flex items-center"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </motion.div>
      )}

      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAIMode ? "Ask AI to find resources..." : "Search resources..."}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-indigo-500 transition-colors ${
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
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg ${
                    view === 'grid'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg ${
                    view === 'list'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Types</option>
                <option value="paper">Papers</option>
                <option value="dataset">Datasets</option>
                <option value="tool">Tools</option>
                <option value="template">Templates</option>
                <option value="guide">Guides</option>
                <option value="external">External Links</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'downloads' | 'rating')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="date">Newest First</option>
                <option value="downloads">Most Downloaded</option>
                <option value="rating">Highest Rated</option>
              </select>

              <button
                onClick={() => {/* Open tags filter modal */}}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Tag className="w-5 h-5" />
                <span>Tags</span>
                {selectedTags.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                    {selectedTags.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className={`grid gap-6 ${
          view === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          <AnimatePresence>
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {resources.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {isAIMode && (
        <ResearchAssistant 
          context="You are a research resource assistant. Help find and recommend relevant research resources based on the user's query. Focus on papers, datasets, and educational materials that match their research interests."
          placeholder="Ask for resource recommendations..."
          onResponse={(response) => {
            // Handle AI response
            console.log('AI Response:', response);
          }}
        />
      )}
    </div>
  );
}