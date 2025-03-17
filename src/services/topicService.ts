import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export interface ResearchTask {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  resources: string[];
  completed: boolean;
}

export interface TopicData {
  id: string;
  title: string;
  description: string;
  category: string;
  relevance: number;
  keywords: string[];
  researchers: number;
  discussions: number;
  papers: number;
  citations: number;
  tasks: ResearchTask[];
  userInteractions: {
    liked: boolean;
    viewedAt: Date;
    selectedAt?: Date;
  };
}

export const saveTopicSelection = async (userId: string, topic: TopicData) => {
  try {
    const topicRef = await addDoc(collection(db, 'userTopics'), {
      userId,
      ...topic,
      selectedAt: new Date(),
      status: 'selected'
    });
    return topicRef.id;
  } catch (error) {
    console.error('Error saving topic selection:', error);
    throw error;
  }
};

export const saveGeneratedTasks = async (userId: string, topicId: string, tasks: ResearchTask[]) => {
  try {
    const tasksRef = await addDoc(collection(db, 'researchTasks'), {
      userId,
      topicId,
      tasks,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return tasksRef.id;
  } catch (error) {
    console.error('Error saving generated tasks:', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId: string, completed: boolean) => {
  try {
    const taskRef = doc(db, 'researchTasks', taskId);
    await updateDoc(taskRef, {
      completed,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

export const saveUserInteraction = async (userId: string, topicId: string, interaction: {
  type: 'like' | 'view' | 'select';
  timestamp: Date;
}) => {
  try {
    await addDoc(collection(db, 'userInteractions'), {
      userId,
      topicId,
      ...interaction
    });
  } catch (error) {
    console.error('Error saving user interaction:', error);
    throw error;
  }
};

export const getUserTopicHistory = async (userId: string) => {
  try {
    const q = query(collection(db, 'userTopics'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user topic history:', error);
    throw error;
  }
}; 