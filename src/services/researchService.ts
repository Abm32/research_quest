import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import type { ResearchProject, ResearchTask, Topic } from '../types';

export const researchService = {
  // Get all research projects for a user
  async getUserProjects(userId: string): Promise<ResearchProject[]> {
    try {
      console.log('Fetching projects for user:', userId);
      const q = query(
        collection(db, 'research_projects'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      console.log('Found projects:', querySnapshot.size);
      
      // If there are no documents, return an empty array (not an error)
      if (querySnapshot.empty) {
        console.log('No projects found for user');
        return [];
      }

      const projects = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as ResearchProject[];
      
      console.log('Processed projects:', projects);
      return projects;
    } catch (error) {
      console.error('Error getting user projects:', error);
      throw new Error('Failed to get user projects');
    }
  },

  // Create a new research project
  async createProject(userId: string, project: Partial<ResearchProject>): Promise<ResearchProject> {
    try {
      console.log('Creating project for user:', userId);
      const projectData = {
        userId,
        title: project.title || 'Untitled Project',
        description: project.description || 'No description provided',
        phase: 'discovery',
        status: 'active',
        progress: 0,
        tasks: [],
        collaborators: project.collaborators || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'research_projects'), projectData);
      console.log('Project created with ID:', docRef.id);
      
      return {
        id: docRef.id,
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as ResearchProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  },

  // Get a research project by ID
  async getProject(projectId: string): Promise<ResearchProject | null> {
    try {
      const docRef = doc(db, 'research_projects', projectId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      } as ResearchProject;
    } catch (error) {
      console.error('Error getting project:', error);
      throw new Error('Failed to get project');
    }
  },

  // Update a research project
  async updateProject(projectId: string, updates: Partial<ResearchProject>): Promise<void> {
    try {
      const docRef = doc(db, 'research_projects', projectId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  },

  // Delete a research project
  async deleteProject(projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'research_projects', projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  },

  // Add a task to a project
  async addTask(projectId: string, task: Partial<ResearchTask>): Promise<string> {
    try {
      const taskData = {
        projectId,
        status: 'todo',
        createdAt: serverTimestamp(),
        ...task
      };

      const docRef = await addDoc(collection(db, 'tasks'), taskData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding task:', error);
      throw new Error('Failed to add task');
    }
  },

  // Update a task
  async updateTask(taskId: string, updates: Partial<ResearchTask>): Promise<void> {
    try {
      const docRef = doc(db, 'tasks', taskId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  },

  // Get all tasks for a project
  async getProjectTasks(projectId: string): Promise<ResearchTask[]> {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      // If there are no tasks, return an empty array (not an error)
      if (querySnapshot.empty) {
        return [];
      }

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate()
      })) as ResearchTask[];
    } catch (error) {
      console.error('Error getting project tasks:', error);
      throw new Error('Failed to get project tasks');
    }
  },

  // New functions for Discovery phase
  async updateProjectTopic(projectId: string, topic: Topic): Promise<void> {
    const projectRef = doc(db, 'research_projects', projectId);
    await updateDoc(projectRef, {
      topic,
      updatedAt: serverTimestamp()
    });
  },

  async updateProjectProgress(projectId: string, phase: string, progress: number): Promise<void> {
    const projectRef = doc(db, 'research_projects', projectId);
    await updateDoc(projectRef, {
      phase,
      progress,
      updatedAt: serverTimestamp()
    });
  },

  async getProjectDetails(projectId: string): Promise<ResearchProject | null> {
    const projectRef = doc(db, 'research_projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      return null;
    }

    return {
      id: projectDoc.id,
      ...projectDoc.data()
    } as ResearchProject;
  },

  async updateProjectPhase(projectId: string, phase: string): Promise<void> {
    const projectRef = doc(db, 'research_projects', projectId);
    await updateDoc(projectRef, {
      phase,
      progress: 0,
      updatedAt: serverTimestamp()
    });
  }
};