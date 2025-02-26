import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  BarChart2,
  Filter,
  Search,
  ChevronDown,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { resourceService } from '../../services/resourceService';
import type { Resource, ResourceStats } from '../../types';

export function AdminDashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchResources = async () => {
      try {
        setLoading(true);
        const [fetchedResources, resourceStats] = await Promise.all([
          resourceService.getAdminResources(filter),
          resourceService.getResourceStats()
        ]);
        setResources(fetchedResources);
        setStats(resourceStats);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [user, filter]);

  const handleApprove = async (resourceId: string) => {
    try {
      await resourceService.updateResourceStatus(resourceId, 'approved');
      setResources(resources.filter(r => r.id !== resourceId));
    } catch (err) {
      console.error('Error approving resource:', err);
      setError('Failed to approve resource');
    }
  };

  const handleReject = async (resourceId: string) => {
    try {
      await resourceService.updateResourceStatus(resourceId, 'rejected');
      setResources(resources.filter(r => r.id !== resourceId));
    } catch (err) {
      console.error('Error rejecting resource:', err);
      setError('Failed to reject resource');
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      await resourceService.deleteResource(resourceId);
      setResources(resources.filter(r => r.id !== resourceId));
    } catch (err) {
      console.error('Error deleting resource:', err);
      setError('Failed to delete resource');
    }
  };

  const handleUpdateResource = async (resourceId: string, updates: Partial<Resource>) => {
    try {
      await resourceService.updateResource(resourceId, updates);
      setResources(resources.map(r => 
        r.id === resourceId ? { ...r, ...updates } : r
      ));
      setIsEditing(false);
      setSelectedResource(null);
    } catch (err) {
      console.error('Error updating resource:', err);
      setError('Failed to update resource');
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-600">Manage and monitor research resources</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          <span className="text-indigo-600 font-medium">Admin Dashboard</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Total Resources</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{stats?.total || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Pending Review</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats?.pending || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Downloads Today</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.downloadsToday || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats?.activeUsers || 0}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between p-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {filter !== 'pending' && (
                  <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                    Active
                  </span>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Resource List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                  <p className="text-gray-600 mt-1">{resource.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                    <span>By {resource.author}</span>
                    <span>•</span>
                    <span>{resource.downloadCount} downloads</span>
                    <span>•</span>
                    <span>Rating: {resource.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApprove(resource.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Approve"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReject(resource.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Reject"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedResource(resource);
                      setIsEditing(true);
                    }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full"
          >
            <h3 className="text-xl font-semibold mb-4">Edit Resource</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateResource(selectedResource.id, selectedResource);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={selectedResource.title}
                    onChange={(e) => setSelectedResource({
                      ...selectedResource,
                      title: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={selectedResource.description}
                    onChange={(e) => setSelectedResource({
                      ...selectedResource,
                      description: e.target.value
                    })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={selectedResource.tags.join(', ')}
                    onChange={(e) => setSelectedResource({
                      ...selectedResource,
                      tags: e.target.value.split(',').map(tag => tag.trim())
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedResource(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}