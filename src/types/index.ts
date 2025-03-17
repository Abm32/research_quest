import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Student' | 'Researcher' | 'Mentor' | 'Administrator';
  bio: string;
  interests: string[];
  expertise: string[];
  photoURL?: string;
  achievements?: UserAchievement[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface ResearchProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  phase: 'discovery' | 'design' | 'development' | 'evaluation';
  status: 'active' | 'completed' | 'archived';
  progress: number;
  topic?: Topic;
  tasks: ResearchTask[];
  collaborators: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  relevance: number | string;
  color?: string;
  keywords: string[];
  researchers?: number;
  discussions?: number;
  trending?: boolean;
  category: string;
  papers?: number;
  citations?: number;
  selectionReason?: string;
  researchInterests?: string[];
  researchGoals?: string[];
  userInteractions?: {
    liked?: boolean;
    viewedAt?: Date;
    selectedAt?: Date;
  };
  trend?: string;
  relatedTopics?: string[];
}

export interface ResearchTask {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  resources: string[];
  completed: boolean;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  type: 'badge' | 'milestone' | 'reward';
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface UserPoints {
  userId: string;
  total: number;
  history: PointTransaction[];
}

export interface PointTransaction {
  id: string;
  amount: number;
  type: 'earned' | 'spent';
  description: string;
  timestamp: Date;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: 'resource' | 'feature' | 'consultation';
  available: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  platform: 'discord' | 'slack' | 'reddit' | 'custom';
  member_count: number;
  activity_level: 'low' | 'medium' | 'high';
  topics: string[];
  created_by: string;
  members: string[];
  searchTerms?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'paper' | 'dataset' | 'tool' | 'template' | 'guide' | 'external';
  author: string;
  source: string;
  url?: string;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  status?: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}

export interface ResourceStats {
  total: number;
  pending: number;
  downloadsToday: number;
  activeUsers: number;
}

export interface SavedResource {
  id: string;
  userId: string;
  resourceId: string;
  notes?: string;
  createdAt: Timestamp;
}

export interface CoreApiResponse {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  downloadUrl: string;
  topics: string[];
  publishedDate: string;
  updatedDate: string;
}

export interface SemanticScholarResponse {
  paperId: string;
  title: string;
  abstract: string;
  authors: Array<{ name: string }>;
  url: string;
  topics: string[];
  year: number;
}

export interface ArxivResponse {
  id: string;
  title: string;
  summary: string;
  authors: Array<{ name: string }>;
  link: string;
  categories: string[];
  published: string;
}

export interface DoajResponse {
  id: string;
  title: string;
  abstract: string;
  authors: Array<{ name: string }>;
  url: string;
  subjects: string[];
  created_date: string;
}