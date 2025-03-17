import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { gamificationService } from '../../services/gamificationService';
import type { LeaderboardEntry } from '../../services/gamificationService';

export function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardData = await gamificationService.getLeaderboard(10);
        setEntries(leaderboardData);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-indigo-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Research Leaderboard</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                entry.userId === user?.uid
                  ? 'bg-indigo-50 border-2 border-indigo-200'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex-shrink-0">
                {getRankIcon(entry.rank)}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {entry.username}
                    {entry.userId === user?.uid && (
                      <span className="ml-2 text-sm text-indigo-600">(You)</span>
                    )}
                  </span>
                  <span className="text-sm text-gray-500">#{entry.rank}</span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600">
                    {entry.totalPoints} points
                  </span>
                  <span className="text-sm text-gray-600">
                    {entry.achievements} achievements
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}