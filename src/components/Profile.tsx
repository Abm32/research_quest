import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  Award, 
  BookOpen, 
  Star, 
  Trophy,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export function Profile() {
  const user = useStore((state) => state.user);

  // Placeholder user data (remove when real authentication is implemented)
  const demoUser = {
    name: 'Dr. Jane Smith',
    role: 'researcher',
    experience_level: 'advanced',
    points: 1250,
    interests: ['Machine Learning', 'Data Science', 'Cognitive Psychology'],
    badges: [
      { id: '1', name: 'Research Pioneer', description: 'Completed first research phase', icon_url: '' },
      { id: '2', name: 'Community Leader', description: 'Helped 50+ researchers', icon_url: '' },
      { id: '3', name: 'Knowledge Sharer', description: 'Shared 20+ resources', icon_url: '' }
    ]
  };

  const displayUser = user || demoUser;

  const stats = [
    { icon: Trophy, label: 'Points', value: displayUser.points },
    { icon: Star, label: 'Badges', value: displayUser.badges.length },
    { icon: BookOpen, label: 'Publications', value: 12 }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center -mt-16 space-y-4 sm:space-y-0">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150"
              alt={displayUser.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md"
            />
            <div className="sm:ml-6 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{displayUser.name}</h1>
              <div className="flex items-center justify-center sm:justify-start space-x-3 mt-2">
                {displayUser.role === 'researcher' ? (
                  <Briefcase className="w-4 h-4 text-gray-500" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-gray-600 capitalize">{displayUser.role}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600 capitalize">{displayUser.experience_level}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <stat.icon className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Research Interests</h2>
        <div className="flex flex-wrap gap-2">
          {displayUser.interests.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-xl shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Badges & Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayUser.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 border border-gray-100 rounded-lg flex items-center space-x-3"
            >
              <Award className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="font-medium text-gray-900">{badge.name}</p>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}