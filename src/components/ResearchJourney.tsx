import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Pencil,
  Code,
  ClipboardCheck,
  ArrowRight,
  ChevronRight,
  Plus,
  Loader2,
  ChevronDown,
  X,
  CheckCircle
} from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { researchService } from '../services/researchService';
import { DiscoveryPhase } from './InteractiveResearchJourney/DiscoveryPhase';
import { DesignPhase } from './InteractiveResearchJourney/DesignPhase';
import { DevelopmentPhase } from './InteractiveResearchJourney/DevelopmentPhase';
import { EvaluationPhase } from './InteractiveResearchJourney/EvaluationPhase';
import { ProjectCreation } from './ResearchJourney/ProjectCreation';
import { TaskTracking } from './ResearchJourney/TaskTracking';
import { PointsDisplay } from './ResearchJourney/PointsDisplay';
import { AchievementsShowcase } from './ResearchJourney/AchievementsShowcase';
import { RewardsStore } from './ResearchJourney/RewardsStore';

type ResearchPhase = 'discovery' | 'design' | 'development' | 'evaluation';

interface PhaseProps {
  projectId: string;
  onPhaseComplete: () => Promise<void>;
}

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  phase: ResearchPhase;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectCreationProps {
  onClose: () => void;
  onProjectCreated: () => Promise<void>;
}

export default function ResearchJourney() {
  const { user } = useAuth();
  const [activePhase, setActivePhase] = useState<ResearchPhase | null>(null);
  const [showProjectCreation, setShowProjectCreation] = useState(false);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'journey' | 'points' | 'achievements' | 'rewards'>('journey');
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log('No user found');
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        console.log('Fetching projects for user:', user.uid);
        setError(null);
        const userProjects = await researchService.getUserProjects(user.uid);
        console.log('Fetched projects:', userProjects);
        setProjects(userProjects);
        
        // If no projects exist, create a default one
        if (userProjects.length === 0) {
          console.log('No projects found, creating default project');
          const defaultProject = await researchService.createProject(user.uid, {
            title: 'My Research Project',
            description: 'Getting started with research',
            phase: 'discovery',
            progress: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          console.log('Created default project:', defaultProject);
          setProjects([defaultProject]);
          setSelectedProject(defaultProject);
          setActivePhase('discovery');
        } else {
          setSelectedProject(userProjects[0]);
          setActivePhase(userProjects[0].phase);
        }
      } catch (err) {
        console.error('Error in fetchProjects:', err);
        setError('Failed to load research projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const phases = [
    {
      id: 'discovery',
      icon: Search,
      title: 'Discovery',
      description: 'Find and explore research topics that match your interests.',
      progress: selectedProject?.phase === 'discovery' ? selectedProject.progress : 100,
      status: selectedProject?.phase === 'discovery' ? 'in-progress' : 'completed',
      component: DiscoveryPhase
    },
    {
      id: 'design',
      icon: Pencil,
      title: 'Design',
      description: 'Plan your research methodology and approach.',
      progress: selectedProject?.phase === 'design' ? selectedProject.progress : 
               selectedProject?.phase === 'discovery' ? 0 : 100,
      status: selectedProject?.phase === 'design' ? 'in-progress' :
              selectedProject?.phase === 'discovery' ? 'locked' : 'completed',
      component: DesignPhase
    },
    {
      id: 'development',
      icon: Code,
      title: 'Development',
      description: 'Conduct your research and collect data.',
      progress: selectedProject?.phase === 'development' ? selectedProject.progress :
               ['discovery', 'design'].includes(selectedProject?.phase || '') ? 0 : 100,
      status: selectedProject?.phase === 'development' ? 'in-progress' :
              ['discovery', 'design'].includes(selectedProject?.phase || '') ? 'locked' : 'completed',
      component: DevelopmentPhase
    },
    {
      id: 'evaluation',
      icon: ClipboardCheck,
      title: 'Evaluation',
      description: 'Analyze results and publish findings.',
      progress: selectedProject?.phase === 'evaluation' ? selectedProject.progress : 0,
      status: selectedProject?.phase === 'evaluation' ? 'in-progress' : 'locked',
      component: EvaluationPhase
    }
  ];

  const handlePhaseClick = (phaseId: string) => {
    if (activePhase === phaseId) {
      setActivePhase(null);
    } else {
      setActivePhase(phaseId as ResearchPhase);
    }
  };

  const handlePhaseComplete = async (phase: string) => {
    if (!selectedProject) return;
    
    try {
      const nextPhase = phases.find(p => p.id === phase)?.id || phase;
      await researchService.updateProjectPhase(selectedProject.id, nextPhase as ResearchPhase);
      
      const updatedProject = {
        ...selectedProject,
        phase: nextPhase as ResearchPhase,
        progress: 0
      };
      
      setSelectedProject(updatedProject);
      setActivePhase(nextPhase as ResearchPhase);
    } catch (err) {
      console.error('Error completing phase:', err);
      setError('Failed to update phase. Please try again.');
    }
  };

  const handleProjectCreated = async () => {
    if (!user) return;
    
    try {
      const userProjects = await researchService.getUserProjects(user.uid);
      setProjects(userProjects);
      if (userProjects.length > 0) {
        setSelectedProject(userProjects[0]);
        setActivePhase('discovery');
      }
      setShowProjectCreation(false);
    } catch (err) {
      console.error('Error fetching projects after creation:', err);
      setError('Failed to load the new project. Please refresh the page.');
    }
  };

  const renderPhaseComponent = () => {
    if (!selectedProject || !activePhase) return null;

    const phase = phases.find(p => p.id === activePhase);
    if (!phase) return null;

    const PhaseComponent = phase.component;
    return (
      <PhaseComponent
        projectId={selectedProject.id}
        onPhaseComplete={() => handlePhaseComplete(activePhase)}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading your research journey...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="text-center py-8">
        <button
          onClick={() => setShowProjectCreation(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Create Your First Research Project
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Journey</h1>
        <p className="text-gray-600">Track your progress through the research process.</p>
      </div>

      {showProjectCreation ? (
        <ProjectCreation
          onClose={() => setShowProjectCreation(false)}
          onProjectCreated={handleProjectCreated}
        />
      ) : (
        <div className="space-y-8">
          {/* Project Selector */}
          <div className="relative">
            <button
              onClick={() => setShowProjectSelector(!showProjectSelector)}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
            >
              <span className="font-medium">{selectedProject.title}</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            {showProjectSelector && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg">
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setActivePhase(project.phase);
                      setShowProjectSelector(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    {project.title}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowProjectSelector(false);
                    setShowProjectCreation(true);
                  }}
                  className="w-full text-left px-4 py-2 text-indigo-600 hover:bg-gray-50"
                >
                  <Plus className="w-5 h-5 inline-block mr-2" />
                  New Project
                </button>
              </div>
            )}
          </div>

          {/* Phase Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {phases.map(phase => (
              <button
                key={phase.id}
                onClick={() => handlePhaseClick(phase.id)}
                className={`p-4 rounded-lg text-left transition-colors ${
                  phase.status === 'locked'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : phase.id === activePhase
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-white hover:bg-gray-50'
                }`}
                disabled={phase.status === 'locked'}
              >
                <phase.icon className="w-6 h-6 mb-2" />
                <h3 className="font-medium">{phase.title}</h3>
                <p className="text-sm text-gray-600">{phase.description}</p>
                <div className="mt-2 h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Active Phase Component */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPhaseComponent()}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}