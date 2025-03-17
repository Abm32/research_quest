import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { db, auth } from '../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  Timestamp,
  limit,
  orderBy,
  arrayUnion,
  addDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';
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

// Current date and user login data
const CURRENT_DATE_TIME = "2025-02-26 14:52:08";
const CURRENT_USER_LOGIN = "Abm32";

interface UserProfile {
  role: 'Student' | 'Researcher' | 'Mentor' | 'Administrator';
  interests: string[];
  expertise: string[];
  bio: string;
  photoURL?: string;
  updatedAt?: Date | Timestamp;
  location?: string;
  email?: string;
  website?: string;
  joined?: Date | Timestamp;
  last_login?: Date | Timestamp;
  profile_completion?: number;
}

interface Achievement {
  id: string;
  title: string;
  category: string;
  description: string;
  earned_date: Date | Timestamp;
  icon_type: 'Star' | 'Award' | 'GraduationCap' | 'Trophy';
  color_theme: 'amber' | 'blue' | 'green' | 'indigo' | 'purple';
  user_id: string;
}

interface ResearchActivityItem {
  id: string;
  type: 'project' | 'publication' | 'achievement' | 'community';
  title: string;
  description?: string;
  timestamp: Date | Timestamp;
  icon_type: string;
  user_id: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  awarded_date: Date | Timestamp;
  user_id: string;
  badge_type: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface UserStats {
  publications: number;
  communities: number;
  badges: number;
  projects: number;
  loading: boolean;
}

const CLOUDINARY_UPLOAD_PRESET = 'research_quest';
const CLOUDINARY_CLOUD_NAME = 'dsahhcgq6';
const CLOUDINARY_API_KEY = '259372399271311';

// Memoized ProfileStat component for better performance
const ProfileStat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isLoading?: boolean;
}> = memo(({ icon, label, value, isLoading = false }) => (
  <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-2">
      {icon}
    </div>
    {isLoading ? (
      <div className="h-7 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
    ) : (
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    )}
    <div className="text-sm text-gray-500">{label}</div>
  </div>
));
ProfileStat.displayName = 'ProfileStat';

// JoinedCommunitiesSection with proper Firebase integration
const JoinedCommunitiesSection = memo(() => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchJoinedCommunities = async () => {
      try {
        // Get communities that the user is a member of
        const q = query(
          collection(db, 'communities'),
          where('members', 'array-contains', user.uid),
          limit(4)  // Limit to 4 for better performance
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
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">Your Research Communities</h2>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
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
            {communities.map((community) => (
              <div
                key={community.id}
                className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {community.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-900">{community.name}</h3>
                  <p className="text-sm text-gray-600">{community.member_count || 0} members</p>
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
});
JoinedCommunitiesSection.displayName = 'JoinedCommunitiesSection';

// ResearchActivity with Firebase integration
const ResearchActivity = memo(() => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ResearchActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchActivities = async () => {
      try {
        const activityRef = collection(db, 'user_activities');
        const q = query(
          activityRef,
          where('user_id', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(3)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // Create default activities if none exist
          const defaultActivities = [
            {
              type: 'project',
              title: 'Started new research project',
              description: 'Initial setup of research methodology',
              timestamp: serverTimestamp(),
              user_id: user.uid,
              icon_type: 'ClipboardList'
            },
            {
              type: 'achievement',
              title: 'Earned first badge',
              description: 'Profile completion badge earned',
              timestamp: serverTimestamp(),
              user_id: user.uid,
              icon_type: 'Award'
            }
          ];

          const activityPromises = defaultActivities.map(activity =>
            addDoc(collection(db, 'user_activities'), activity)
          );

          const newActivityRefs = await Promise.all(activityPromises);

          // Create activities data with IDs
          const newActivities = defaultActivities.map((activity, index) => ({
            id: newActivityRefs[index].id,
            ...activity
          }));

          setActivities(newActivities as ResearchActivityItem[]);
        } else {
          const fetchedActivities = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ResearchActivityItem[];

          setActivities(fetchedActivities);
        }
      } catch (error) {
        console.error('Error fetching research activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  // Icon mapping for activity types
  const getActivityIcon = useCallback((iconType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'ClipboardList': <ClipboardList className="h-4 w-4 text-indigo-600" />,
      'Award': <Award className="h-4 w-4 text-amber-600" />,
      'BookOpen': <BookOpen className="h-4 w-4 text-blue-600" />,
      'Users': <Users className="h-4 w-4 text-purple-600" />,
      'Trophy': <Trophy className="h-4 w-4 text-green-600" />,
      'CheckCircle2': <CheckCircle2 className="h-4 w-4 text-emerald-600" />
    };
    return iconMap[iconType] || <Activity className="h-4 w-4 text-gray-600" />;
  }, []);

  // Helper to format timestamps
  const formatDate = useCallback((timestamp: Timestamp | Date) => {
    if (!timestamp) return 'Just now';

    const date = timestamp instanceof Timestamp
      ? timestamp.toDate()
      : new Date(timestamp);

    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-800">Research Activity</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse"></div>
                <div className="ml-4 flex-grow">
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
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
        {activities.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className={`h-8 w-8 rounded-full bg-${activity.type === 'achievement' ? 'amber' : activity.type === 'project' ? 'indigo' : 'green'}-100 flex items-center justify-center`}>
                    {getActivityIcon(activity.icon_type)}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  {activity.description && (
                    <p className="text-xs text-gray-600 mt-0.5">{activity.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

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
});
ResearchActivity.displayName = 'ResearchActivity';

// Memoized AchievementsSection component
const AchievementsSection = memo(() => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAchievements = async () => {
      try {
        const achievementsRef = collection(db, 'user_achievements');
        const achievementsQuery = query(
          achievementsRef,
          where('user_id', '==', user.uid),
          orderBy('earned_date', 'desc'),
          limit(3)
        );

        const snapshot = await getDocs(achievementsQuery);

        if (snapshot.empty) {
          // Create default achievements for new users
          const defaultAchievements = [
            {
              title: 'Research Pioneer',
              category: 'Platform',
              description: 'Joined the Research Quest platform',
              earned_date: serverTimestamp(),
              user_id: user.uid,
              icon_type: 'Star',
              color_theme: 'amber'
            },
            {
              title: 'First Steps',
              category: 'Research',
              description: 'Completed profile setup',
              earned_date: serverTimestamp(),
              user_id: user.uid,
              icon_type: 'Award',
              color_theme: 'blue'
            },
            {
              title: 'Knowledge Seeker',
              category: 'Learning',
              description: 'Accessed learning resources',
              earned_date: serverTimestamp(),
              user_id: user.uid,
              icon_type: 'GraduationCap',
              color_theme: 'green'
            }
          ];

          const achievementPromises = defaultAchievements.map(achievement =>
            addDoc(collection(db, 'user_achievements'), achievement)
          );

          const newAchievementRefs = await Promise.all(achievementPromises);
          const newAchievements = defaultAchievements.map((achievement, index) => ({
            id: newAchievementRefs[index].id,
            ...achievement
          }));

          setAchievements(newAchievements as Achievement[]);
        } else {
          const fetchedAchievements = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Achievement[];

          setAchievements(fetchedAchievements);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-800">Research Achievements</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
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
        {achievements.length > 0 ? (
          <div className="space-y-4">
            {achievements.map((achievement) => {
              // Dynamic icon based on achievement type
              const getIcon = () => {
                switch (achievement.icon_type) {
                  case 'Star': return <Star className="h-5 w-5 text-amber-700" />;
                  case 'Award': return <Award className="h-5 w-5 text-blue-700" />;
                  case 'GraduationCap': return <GraduationCap className="h-5 w-5 text-green-700" />;
                  case 'Trophy': return <Trophy className="h-5 w-5 text-purple-700" />;
                  default: return <Star className="h-5 w-5 text-amber-700" />;
                }
              };

              // Dynamic gradient based on color theme
              const getBgGradient = () => {
                switch (achievement.color_theme) {
                  case 'amber': return 'from-amber-50 to-amber-100';
                  case 'blue': return 'from-blue-50 to-blue-100';
                  case 'green': return 'from-green-50 to-green-100';
                  case 'indigo': return 'from-indigo-50 to-indigo-100';
                  case 'purple': return 'from-purple-50 to-purple-100';
                  default: return 'from-amber-50 to-amber-100';
                }
              };

              // Dynamic icon background color
              const getIconBg = () => {
                switch (achievement.color_theme) {
                  case 'amber': return 'bg-amber-200';
                  case 'blue': return 'bg-blue-200';
                  case 'green': return 'bg-green-200';
                  case 'indigo': return 'bg-indigo-200';
                  case 'purple': return 'bg-purple-200';
                  default: return 'bg-amber-200';
                }
              };

              return (
                <div
                  key={achievement.id}
                  className={`flex items-center space-x-3 p-3 bg-gradient-to-r ${getBgGradient()} rounded-lg`}
                >
                  <div className={`${getIconBg()} p-2 rounded-full`}>
                    {getIcon()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 mb-4">No achievements earned yet</p>
            <Link
              to="/resources"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Explore Resources to Earn Achievements
            </Link>
          </div>
        )}

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
  );
});
AchievementsSection.displayName = 'AchievementsSection';

// Memoized AccountInfoCard component
const AccountInfoCard = memo(({ profile }: { profile: UserProfile }) => {
  const formatJoinedDate = useCallback((timestamp?: Timestamp | Date) => {
    if (!timestamp) return 'Recently';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
    >
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Account Info</h2>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
            {CURRENT_USER_LOGIN}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <span className="text-gray-600">Last login</span>
          <span className="text-gray-900 font-medium">{CURRENT_DATE_TIME}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <span className="text-gray-600">Member since</span>
          <span className="text-gray-900 font-medium">{formatJoinedDate(profile.joined)}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <span className="text-gray-600">Profile completion</span>
          <div className="flex items-center">
            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${profile.profile_completion || 0}%` }}
              />
            </div>
            <span className="text-gray-900 font-medium">{profile.profile_completion || 0}%</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Account type</span>
          <span className="text-gray-900 font-medium">{profile.role}</span>
        </div>
      </div>
    </motion.div>
  );
});
AccountInfoCard.displayName = 'AccountInfoCard';

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

  // User stats from Firebase
  const [stats, setStats] = useState<UserStats>({
    publications: 0,
    communities: 0,
    badges: 0,
    projects: 0,
    loading: true
  });

  // Calculate profile completion percentage
  const calculateProfileCompletion = useCallback((profile: UserProfile): number => {
    let completionScore = 0;
    const totalFields = 7;  // Total fields counting toward completion

    if (profile.photoURL) completionScore += 1;
    if (profile.bio && profile.bio.length > 10) completionScore += 1;
    if (profile.interests && profile.interests.length > 0) completionScore += 1;
    if (profile.expertise && profile.expertise.length > 0) completionScore += 1;
    if (profile.location) completionScore += 1;
    if (profile.email) completionScore += 1;
    if (profile.website) completionScore += 1;

    return Math.round((completionScore / totalFields) * 100);
  }, []);

  // Fetch user stats from Firebase
  useEffect(() => {
    if (!user) return;

    const fetchUserStats = async () => {
      try {
        // Get publication count
        const publicationsRef = collection(db, 'publications');
        const publicationsQuery = query(publicationsRef, where('author_id', '==', user.uid));
        const publicationsSnapshot = await getDocs(publicationsQuery);

        // Get communities count
        const communitiesRef = collection(db, 'communities');
        const communitiesQuery = query(communitiesRef, where('members', 'array-contains', user.uid));
        const communitiesSnapshot = await getDocs(communitiesQuery);

        // Get badges
        const badgesRef = collection(db, 'user_badges');
        const badgesQuery = query(badgesRef, where('user_id', '==', user.uid));
        let badgesSnapshot = await getDocs(badgesQuery);

        // Get projects count
        const projectsRef = collection(db, 'research_projects');
        const projectsQuery = query(projectsRef, where('members', 'array-contains', user.uid));
        const projectsSnapshot = await getDocs(projectsQuery);

        // If no badges exist, create default badges
        if (badgesSnapshot.empty) {
          // Create default badges for new users
          const defaultBadges = [
            {
              name: 'Profile Creator',
              description: 'Created a profile on Research Quest',
              awarded_date: serverTimestamp(),
              user_id: user.uid,
              badge_type: 'bronze'
            }
          ];

          const badgePromises = defaultBadges.map(badge =>
            addDoc(collection(db, 'user_badges'), badge)
          );

          await Promise.all(badgePromises);

          // Re-fetch badges count
          badgesSnapshot = await getDocs(badgesQuery);
        }

        // Update stats
        setStats({
          publications: publicationsSnapshot.size,
          communities: communitiesSnapshot.size,
          badges: badgesSnapshot.size,
          projects: projectsSnapshot.size,
          loading: false
        });

      } catch (error) {
        console.error('Error fetching user stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchUserStats();
  }, [user]);

  // Fetch user profile
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
          const userData = docSnap.data() as UserProfile;
          const profileCompletionScore = calculateProfileCompletion(userData);

          setProfile({
            role: userData.role || 'Student',
            interests: userData.interests || [],
            expertise: userData.expertise || [],
            bio: userData.bio || '',
            photoURL: userData.photoURL,
            updatedAt: userData.updatedAt,
            location: userData.location || '',
            email: userData.email || user.email || '',
            website: userData.website || '',
            joined: userData.joined || serverTimestamp(),
            last_login: serverTimestamp(),
            profile_completion: profileCompletionScore,
          });

          // Update last login time
          await updateDoc(userRef, {
            last_login: serverTimestamp()
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
            joined: serverTimestamp(),
            last_login: serverTimestamp(),
            updatedAt: serverTimestamp(),
            profile_completion: 20,  // Base completion percentage for new profile
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
  }, [user, navigate, calculateProfileCompletion]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

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
        await updateProfile(user, {
          photoURL: data.secure_url
        });

        // Also update the profile document in Firestore
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          photoURL: data.secure_url,
          updatedAt: serverTimestamp()
        });
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
      // Calculate new profile completion score
      const profileCompletionScore = calculateProfileCompletion(profile);

      // Prepare profile data with updated timestamp
      const profileData = {
        ...profile,
        updatedAt: serverTimestamp(),
        profile_completion: profileCompletionScore
      };

      // Update the profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, profileData);

      // Update auth profile if photo has changed
      if (profile.photoURL && profile.photoURL !== user.photoURL) {
        await updateProfile(user, {
          photoURL: profile.photoURL
        });
      }

      setIsEditing(false);
      setError('Profile updated successfully!');
      setTimeout(() => setError(null), 3000);

      // Create profile completion achievement if applicable
      if (profileCompletionScore > 50) {
        const achievementRef = collection(db, 'user_achievements');
        const achievementQuery = query(
          achievementRef,
          where('user_id', '==', user.uid),
          where('title', '==', 'Profile Master')
        );
        const achievementSnapshot = await getDocs(achievementQuery);

        if (achievementSnapshot.empty) {
          await addDoc(collection(db, 'user_achievements'), {
            title: 'Profile Master',
            category: 'Platform',
            description: 'Achieved a profile completion score of over 50%',
            earned_date: serverTimestamp(),
            user_id: user.uid,
            icon_type: 'Award',
            color_theme: 'green'
          });
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const handleAddInterest = useCallback(() => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  }, [newInterest, profile.interests]);

  const handleAddExpertise = useCallback(() => {
    if (newExpertise.trim() && !profile.expertise.includes(newExpertise.trim())) {
      setProfile(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  }, [newExpertise, profile.expertise]);

  const handleRemoveInterest = useCallback((interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  }, []);

  const handleRemoveExpertise = useCallback((expertise: string) => {
    setProfile(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== expertise)
    }));
  }, []);

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
            className={`p-4 rounded-lg flex items-center ${error.includes('success')
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
              <span className="text-sm font-medium">Last updated: 2025-02-26 15:09:52</span>
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
                        alt={user?.displayName || 'Abm32'}
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
                        {/* <option value="Researcher" className="bg-indigo-700 text-white">Researcher</option>
                        <option value="Mentor" className="bg-indigo-700 text-white">Mentor</option> */}
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
              value={stats.publications}
              isLoading={stats.loading}
            />
            <ProfileStat
              icon={<Users className="h-5 w-5" />}
              label="Communities"
              value={stats.communities}
              isLoading={stats.loading}
            />
            <ProfileStat
              icon={<Award className="h-5 w-5" />}
              label="Badges"
              value={stats.badges}
              isLoading={stats.loading}
            />
            <ProfileStat
              icon={<ClipboardList className="h-5 w-5" />}
              label="Projects"
              value={stats.projects}
              isLoading={stats.loading}
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
            <AchievementsSection />

            {/* User Info Card - Only show in view mode */}
            {!isEditing && (
              <AccountInfoCard profile={profile} />
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