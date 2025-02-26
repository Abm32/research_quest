import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { db, auth } from '../config/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { 
  Award, 
  BookOpen, 
  Star, 
  Trophy,
  Briefcase,
  GraduationCap,
  Upload,
  Plus,
  X,
  AlertCircle,
  Users,
  MessageCircle,
  Edit,
  Camera,
  Calendar,
  ClipboardList,
  MapPin,
  Mail,
  Link2,
  ChevronRight,
  CheckCircle2,
  Activity
} from 'lucide-react';
import type { Community } from '../types';

interface UserProfile {
  role: 'Student' | 'Researcher' | 'Mentor' | 'Administrator';
  interests: string[];
  expertise: string[];
  bio: string;
  photoURL?: string;
  updatedAt?: Date;
  location?: string;
  email?: string;
  website?: string;
  joined?: Date;
}

const CLOUDINARY_UPLOAD_PRESET = 'research_quest';
const CLOUDINARY_CLOUD_NAME = 'dsahhcgq6';
const CLOUDINARY_API_KEY = '259372399271311';

const ProfileStat: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ 
  icon, 
  label, 
  value 
}) => (
  <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-2">
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const JoinedCommunitiesSection = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchJoinedCommunities = async () => {
      try {
        const q = query(
          collection(db, 'communities'),
          where('members', 'array-contains', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const joinedCommunities = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Community[];
        setCommunities(joinedCommunities);
      } catch (error) {
        console.error('Error fetching joined communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedCommunities();
  }, [user]);

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-xl"></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
    >
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">Your Research Communities</h2>
          </div>
          <Link
            to="/communities/joined"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        {communities.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-3">You haven't joined any communities yet</p>
            <Link
              to="/communities"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Explore Communities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communities.slice(0, 4).map((community) => (
              <div
                key={community.id}
                className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {community.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-900">{community.name}</h3>
                  <p className="text-sm text-gray-600">{community.member_count} members</p>
                </div>
                <Link
                  to={`/communities/${community.id}/chat`}
                  className="flex-shrink-0 flex items-center space-x-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Chat</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ResearchActivity = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
  >
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100">
      <div className="flex items-center space-x-2">
        <Activity className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-gray-800">Research Activity</h2>
      </div>
    </div>
    
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">Completed literature review for quantum computing research</p>
            <p className="text-xs text-gray-500 mt-1">2 days ago</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">Started new research project on machine learning ethics</p>
            <p className="text-xs text-gray-500 mt-1">1 week ago</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Award className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">Earned Research Methodology badge</p>
            <p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Link
          to="/activity"
          className="w-full py-2 flex justify-center items-center text-sm text-indigo-600 hover:text-indigo-800 border border-dashed border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          View Full Activity History
        </Link>
      </div>
    </div>
  </motion.div>
);

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    role: 'Student',
    interests: [],
    expertise: [],
    bio: '',
    location: '',
    email: '',
    website: '',
  });
  const [newInterest, setNewInterest] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Current date and user login provided
  const currentDateTime = "2025-02-26 13:20:19";
  const currentUserLogin = "Abm32";

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile({
            role: data.role || 'Student',
            interests: data.interests || [],
            expertise: data.expertise || [],
            bio: data.bio || '',
            photoURL: data.photoURL,
            location: data.location || '',
            email: data.email || user.email || '',
            website: data.website || '',
            joined: data.joined || new Date(),
          });
        } else {
          const initialProfile: UserProfile = {
            role: 'Student',
            interests: [],
            expertise: [],
            bio: '',
            photoURL: user.photoURL || undefined,
            location: '',
            email: user.email || '',
            website: '',
            joined: new Date(),
            updatedAt: new Date(),
          };
          await setDoc(userRef, initialProfile);
          setProfile(initialProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
      formData.append('api_key', CLOUDINARY_API_KEY);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload image');
      }

      const data = await response.json();
      
      if (data.secure_url) {
        setProfile(prev => ({ ...prev, photoURL: data.secure_url }));
        
        // Update Firebase auth profile
        if (user) {
          await updateProfile(user, {
            photoURL: data.secure_url
          });

          // Also update the profile document in Firestore
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            ...profile,
            photoURL: data.secure_url,
            updatedAt: new Date()
          }, { merge: true });
        }
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);

    try {
      const usersRef = collection(db, 'users');
      
      const profileData: UserProfile = {
        ...profile,
        updatedAt: new Date(),
      };

      await setDoc(doc(usersRef, user.uid), profileData);

      if (profile.photoURL && profile.photoURL !== user.photoURL) {
        await updateProfile(user, {
          photoURL: profile.photoURL
        });
      }

      setIsEditing(false);
      // Show success message as a toast or notification instead of alert
      setError('Profile updated successfully!');
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };
    const handleAddInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleAddExpertise = () => {
    if (newExpertise.trim() && !profile.expertise.includes(newExpertise.trim())) {
      setProfile(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleRemoveExpertise = (expertise: string) => {
    setProfile(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== expertise)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg flex items-center ${
              error.includes('success') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {error.includes('success') ? (
              <CheckCircle2 className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {error}
          </motion.div>
        )}

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="h-40 bg-gradient-to-r from-indigo-600 to-violet-500 relative">
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-6 text-white flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Last updated: 2025-02-26 13:22:35</span>
            </div>
          </div>
          <div className="relative px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <div className="flex flex-col items-center sm:items-start">
                <div className="relative -mt-20 sm:-mt-24">
                  <div className={`h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-white shadow-lg ${uploadingImage ? 'opacity-50' : ''}`}>
                    {user?.photoURL || profile.photoURL ? (
                      <img
                        src={profile.photoURL || user?.photoURL}
                        alt={user?.displayName || ''}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Users className="w-14 h-14 text-gray-400" />
                      </div>
                    )}
                    {uploadingImage && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-1 right-1 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 cursor-pointer shadow-md">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                      <Camera className="w-5 h-5" />
                    </label>
                  )}
                </div>
                
                <div className="mt-4 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">{user?.displayName || 'Abm32'}</h1>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium">
                    {isEditing ? (
                      <select
                        value={profile.role}
                        onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value as UserProfile['role'] }))}
                        className="bg-transparent text-white focus:outline-none"
                      >
                        <option value="Student" className="bg-indigo-700 text-white">Student</option>
                        <option value="Researcher" className="bg-indigo-700 text-white">Researcher</option>
                        <option value="Mentor" className="bg-indigo-700 text-white">Mentor</option>
                        <option value="Administrator" className="bg-indigo-700 text-white">Administrator</option>
                      </select>
                    ) : (
                      <span>{profile.role}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-grow flex flex-col items-center sm:items-start sm:mt-0 mt-4">
                {/* Contact info */}
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600 mt-2">
                  {isEditing ? (
                    <>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <input
                          type="text"
                          value={profile.location || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Location"
                          className="border-b border-gray-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5"
                        />
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <input
                          type="email"
                          value={profile.email || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Email"
                          className="border-b border-gray-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5"
                        />
                      </div>
                      <div className="flex items-center">
                        <Link2 className="w-4 h-4 mr-2 text-gray-400" />
                        <input
                          type="url"
                          value={profile.website || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="Website"
                          className="border-b border-gray-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {profile.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center">
                          <Link2 className="w-4 h-4 mr-2 text-gray-400" />
                          <a href={profile.website} className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
                            {profile.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {!isEditing && (
                  <div className="mt-6 sm:mt-auto flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                    <Link
                      to="/publications"
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Publications
                    </Link>
                    <Link
                      to="/projects"
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Research Projects
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <ProfileStat 
              icon={<BookOpen className="h-5 w-5" />} 
              label="Publications" 
              value={3} 
            />
            <ProfileStat 
              icon={<Users className="h-5 w-5" />} 
              label="Communities" 
              value={2} 
            />
            <ProfileStat 
              icon={<Award className="h-5 w-5" />} 
              label="Badges" 
              value={7} 
            />
            <ProfileStat 
              icon={<Trophy className="h-5 w-5" />} 
              label="Research Impact" 
              value="High" 
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">About Me</h2>
              </div>
              <div className="p-6">
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
                    placeholder="Tell us about yourself and your research interests..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {profile.bio || 'No bio provided. Click "Edit Profile" to add information about yourself.'}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Research Interests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Research Interests</h2>
              </div>
              <div className="p-6">
                {isEditing ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                        >
                          {interest}
                          <button
                            onClick={() => handleRemoveInterest(interest)}
                            className="ml-2 text-indigo-400 hover:text-indigo-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                        placeholder="Add a research interest"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddInterest}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm flex items-center"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {profile.interests.length > 0 ? (
                      profile.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-medium shadow-sm"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No research interests added yet</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Areas of Expertise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Areas of Expertise</h2>
              </div>
              <div className="p-6">
                {isEditing ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.expertise.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                        >
                          {item}
                          <button
                            onClick={() => handleRemoveExpertise(item)}
                            className="ml-2 text-green-400 hover:text-green-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newExpertise}
                        onChange={(e) => setNewExpertise(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpertise())}
                        placeholder="Add an area of expertise"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddExpertise}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm flex items-center"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {profile.expertise.length > 0 ? (
                      profile.expertise.map((item) => (
                        <span
                          key={item}
                          className="px-4 py-2 bg-gradient-to-r from-green-50 to-teal-50 text-green-700 rounded-full text-sm font-medium shadow-sm"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No expertise areas added yet</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Research Activity - Only show in view mode */}
            {!isEditing && <ResearchActivity />}
          </div>
          
          <div className="space-y-8">
            {/* Joined Communities */}
            <JoinedCommunitiesSection />
            
            {/* Research Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-gray-800">Research Achievements</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                    <div className="bg-amber-200 p-2 rounded-full">
                      <Star className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Top Contributor</h3>
                      <p className="text-sm text-gray-600">Data Science Community</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="bg-blue-200 p-2 rounded-full">
                      <Award className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Research Excellence</h3>
                      <p className="text-sm text-gray-600">Quantum Computing Project</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="bg-green-200 p-2 rounded-full">
                      <GraduationCap className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Methodology Mastery</h3>
                      <p className="text-sm text-gray-600">Completed advanced training</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Link
                    to="/achievements"
                    className="inline-block px-4 py-2 text-sm text-amber-700 hover:text-amber-800 font-medium"
                  >
                    View All Achievements
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* User Info Card - Only show in view mode */}
            {!isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Account Info</h2>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                      Abm32
                    </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Last login</span>
                    <span className="text-gray-900 font-medium">2025-02-26 13:24:15</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Member since</span>
                    <span className="text-gray-900 font-medium">January 2025</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Profile completion</span>
                    <span className="text-gray-900 font-medium">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account type</span>
                    <span className="text-gray-900 font-medium">{profile.role}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Edit Mode Save/Cancel Actions */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white sticky bottom-0 p-4 shadow-lg rounded-t-xl border border-gray-100 flex justify-end space-x-4 mt-8"
          >
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleProfileUpdate}
              disabled={saving}
              className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm flex items-center justify-center min-w-[100px]"
            >
              {saving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}