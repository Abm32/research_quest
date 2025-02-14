export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'researcher' | 'student' | 'professor' | 'professional';
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  points: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  platform: 'discord' | 'slack' | 'reddit';
  member_count: number;
  activity_level: 'low' | 'medium' | 'high';
  topics: string[];
}

export interface ResearchPhase {
  id: string;
  name: 'discovery' | 'design' | 'development' | 'evaluation';
  progress: number;
  completed: boolean;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to?: string;
  status: 'todo' | 'in_progress' | 'completed';
  due_date?: Date;
}