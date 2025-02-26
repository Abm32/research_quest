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
  AlertCircle,
  ChevronDown,
  X,
  Bookmark,
  BookmarkCheck
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
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        let results: Resource[] = [];

        if (isAIMode && debouncedSearchQuery) {
          results = await resourceService.searchAllPlatforms(debouncedSearchQuery);
        } else {
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
    const { user } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      const checkIfSaved = async () => {
        if (!user) return;
        try {
          const savedResources = await resourceService.getSavedResources(user.uid);
          setIsSaved(savedResources.some(sr => sr.resourceId === resource.id));
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      };
      checkIfSaved();
    }, [user, resource.id]);

    const handleBookmark = async () => {
      if (!user) return;
      try {
        setSaving(true);
        if (isSaved) {
          // Find the saved resource ID and remove it
          const savedResources = await resourceService.getSavedResources(user.uid);
          const savedResource = savedResources.find(sr => sr.resourceId === resource.id);
          if (savedResource) {
            await resourceService.unsaveResource(savedResource.id);
          }
        } else {
          await resourceService.saveResource(user.uid, resource.id);
        }
        setIsSaved(!isSaved);
      } catch (error) {
        console.error('Error toggling bookmark:', error);
      } finally {
        setSaving(false);
      }
    };

    const Icon = getResourceIcon(resource.type);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ${
          view === 'list' ? 'flex items-start space-x-4' : ''
        }`}
      >
        <div className="p-4">
          <div className="flex items-start space-x-3 mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
              <Icon className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">{resource.title}</h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="truncate">{resource.author}</span>
                <span>•</span>
                <span className="truncate">{resource.source}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{resource.tags.length - 2} more</span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-3 text-sm">
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
              {user && (
                <button
                  onClick={handleBookmark}
                  disabled={saving}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved 
                      ? 'text-indigo-600 hover:bg-indigo-50' 
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              )}
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
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-1 text-sm"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <button
                  onClick={() => handleDownload(resource.id)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Research Resources</h1>
          <p className="text-gray-600 text-sm sm:text-base">Discover and share valuable research materials</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Resource</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAIMode ? "Ask AI to find resources..." : "Search resources..."}
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

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span className="ml-2">Filters</span>
                {(selectedType || selectedTags.length > 0 || sortBy !== 'downloads') && (
                  <span className="ml-2 bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                    Active
                  </span>
                )}
                <ChevronDown className={`ml-2 w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <select
                value={view}
                onChange={(e) => setView(e.target.value as 'grid' | 'list')}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'downloads' | 'rating')}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="downloads">Most Downloaded</option>
                <option value="rating">Highest Rated</option>
                <option value="date">Most Recent</option>
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
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="paper">Papers</option>
                    <option value="dataset">Datasets</option>
                    <option value="tool">Tools</option>
                    <option value="template">Templates</option>
                    <option value="guide">Guides</option>
                    <option value="external">External Links</option>
                  </select>

                  <button
                    onClick={() => {/* Open tags filter modal */}}
                    className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <Tag className="w-5 h-5" />
                      <span>Tags</span>
                    </div>
                    {selectedTags.length > 0 && (
                      <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                        {selectedTags.length}
                      </span>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className={`grid gap-4 sm:gap-6 ${
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
          <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {isAIMode && (
        <ResearchAssistant 
          context="You are a research resource assistant. Help find and recommend relevant research resources based on the user's query. Focus on papers, datasets, and educational materials that match their research interests."
          placeholder="Ask for resource recommendations..."
          onResponse={(response) => {
            console.log('AI Response:', response);
          }}
        />
      )}
    </div>
  );
}