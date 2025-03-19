import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  increment,
  arrayUnion,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  setDoc
} from 'firebase/firestore';
import type { UserAchievement, UserPoints, Reward } from '../types';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  achievements: number;
  rank: number;
}

export const gamificationService = {
  // Award points to a user
  async awardPoints(userId: string, points: number, reason: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create user document with initial data
      await setDoc(userRef, {
        totalPoints: points,
        achievements: [],
        pointsHistory: [{
          points,
          reason,
          timestamp: new Date().toISOString()
        }],
        updatedAt: new Date().toISOString()
      });
    } else {
      // Update existing user document
      await updateDoc(userRef, {
        totalPoints: increment(points),
        pointsHistory: arrayUnion({
          points,
          reason,
          timestamp: new Date().toISOString()
        }),
        updatedAt: new Date().toISOString()
      });
    }

    // Update leaderboard
    await this.updateLeaderboard(userId);
  },

  // Get user's points
  async getUserPoints(userId: string): Promise<number> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().totalPoints || 0 : 0;
  },

  // Award an achievement to a user
  async awardAchievement(userId: string, achievement: Partial<UserAchievement>): Promise<void> {
    const achievementData = {
      ...achievement,
      earnedAt: new Date().toISOString(),
      id: `${userId}-${achievement.title}-${Date.now()}`
    };

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create user document with initial data
      await setDoc(userRef, {
        totalPoints: achievement.points || 0,
        achievements: [achievementData],
        updatedAt: new Date().toISOString()
      });
    } else {
      // Update existing user document
      await updateDoc(userRef, {
        achievements: arrayUnion(achievementData),
        updatedAt: new Date().toISOString()
      });
    }

    // Award points for achievement
    if (achievement.points) {
      await this.awardPoints(userId, achievement.points, `Achievement: ${achievement.title}`);
    }
  },

  // Get user's achievements
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().achievements || [] : [];
  },

  // Get available rewards
  async getAvailableRewards(): Promise<Reward[]> {
    const querySnapshot = await getDocs(collection(db, 'rewards'));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }) as Reward)
      .filter(reward => reward.available);
  },

  // Redeem a reward
  async redeemReward(userId: string, rewardId: string): Promise<boolean> {
    const rewardRef = doc(db, 'rewards', rewardId);
    const userPointsRef = doc(db, 'points', userId);
    
    const rewardDoc = await getDoc(rewardRef);
    const userPointsDoc = await getDoc(userPointsRef);
    
    if (!rewardDoc.exists() || !userPointsDoc.exists()) {
      return false;
    }

    const reward = rewardDoc.data() as Reward;
    const userPoints = userPointsDoc.data() as UserPoints;

    if (userPoints.total < reward.pointsCost) {
      return false;
    }

    // Deduct points and record transaction
    await updateDoc(userPointsRef, {
      total: increment(-reward.pointsCost),
      history: arrayUnion({
        id: crypto.randomUUID(),
        amount: -reward.pointsCost,
        type: 'spent',
        description: `Redeemed reward: ${reward.title}`,
        timestamp: new Date().toISOString()
      })
    });

    return true;
  },

  // Get leaderboard
  async getLeaderboard(limitCount: number = 10): Promise<LeaderboardEntry[]> {
    const usersRef = collection(db, 'users');
    const leaderboardQuery = query(
      usersRef,
      orderBy('totalPoints', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(leaderboardQuery);
    return snapshot.docs.map((doc, index) => ({
      userId: doc.id,
      username: doc.data().displayName || 'Anonymous',
      totalPoints: doc.data().totalPoints || 0,
      achievements: doc.data().achievements?.length || 0,
      rank: index + 1
    }));
  },

  // Update leaderboard for a specific user
  async updateLeaderboard(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    const userData = userDoc.data();
    const totalPoints = userData.totalPoints || 0;
    const achievements = userData.achievements || [];

    // Update user's rank in leaderboard
    await updateDoc(userRef, {
      leaderboardRank: {
        totalPoints,
        achievements: achievements.length,
        lastUpdated: new Date().toISOString()
      }
    });
  },

  // Get phase-specific achievements
  async getPhaseAchievements(phase: string): Promise<UserAchievement[]> {
    const achievementsRef = collection(db, 'phase_achievements');
    const phaseQuery = query(
      achievementsRef,
      where('phase', '==', phase)
    );

    const snapshot = await getDocs(phaseQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserAchievement[];
  }
};