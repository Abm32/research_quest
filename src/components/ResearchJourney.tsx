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
  X
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
import type { ResearchProject } from '../types';

export default function ResearchJourney() {
  const { user } = useAuth();
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [showProjectCreation, setShowProjectCreation] = useState(false);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'journey' | 'points' | 'achievements' | 'rewards'>('journey');
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
        setError(null);
        const userProjects = await researchService.getUserProjects(user.uid);
        setProjects(userProjects);
        if (userProjects.length > 0) {
          setSelectedProject(userProjects[0]);
        }
      } catch (err) {
        console.error(err);
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
      setActivePhase(phaseId);
    }
  };

  const handleProjectCreated = async () => {
    if (!user) return;
    
    try {
      setError(null);
      const userProjects = await researchService.getUserProjects(user.uid);
      setProjects(userProjects);
      if (userProjects.length > 0) {
        setSelectedProject(userProjects[0]);
      }
      setShowProjectCreation(false);
    } catch (err) {
      console.error(err);
      setError('Failed to refresh projects. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 border-b">
        <div className="flex space-x-4 min-w-full sm:min-w-0">
          <button
            onClick={() => setActiveTab('journey')}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
              activeTab === 'journey'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Research Journey
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
              activeTab === 'points'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Points
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
              activeTab === 'achievements'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
              activeTab === 'rewards'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Rewards
          </button>
        </div>
      </div>

      {activeTab === 'journey' && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Research Journey</h1>
              <p className="text-gray-600 text-sm sm:text-base">Track your progress through each phase of your research</p>
            </div>
            <button
              onClick={() => setShowProjectCreation(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {showProjectCreation ? (
            <ProjectCreation onProjectCreated={handleProjectCreated} />
          ) : (
            <>
              {projects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Start Your Research Journey
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    Create your first research project to begin
                  </p>
                  <button
                    onClick={() => setShowProjectCreation(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Create Your First Project
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Project Selection */}
                  {projects.length > 1 && (
                    <div className="mb-6">
                      <button
                        onClick={() => setShowProjectSelector(!showProjectSelector)}
                        className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                      >
                        <span>{selectedProject?.title}</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${showProjectSelector ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {showProjectSelector && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                          >
                            {projects.map((project) => (
                              <button
                                key={project.id}
                                onClick={() => {
                                  setSelectedProject(project);
                                  setShowProjectSelector(false);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                                  project.id === selectedProject?.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                                }`}
                              >
                                {project.title}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Phases */}
                  <div className="space-y-4 sm:space-y-6">
                    {phases.map((phase, index) => (
                      <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-xl shadow-sm overflow-hidden
                          ${phase.status === 'locked' ? 'opacity-50' : ''}`}
                      >
                        <div 
                          className={`p-4 sm:p-6 cursor-pointer transition-colors
                            ${phase.status !== 'locked' ? 'hover:bg-gray-50' : ''}
                            ${activePhase === phase.id ? 'bg-gray-50' : ''}`}
                          onClick={() => phase.status !== 'locked' && handlePhaseClick(phase.id)}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0
                              ${phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                                phase.status === 'in-progress' ? 'bg-indigo-100 text-indigo-600' :
                                'bg-gray-100 text-gray-600'}`}
                            >
                              <phase.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{phase.title}</h3>
                                {phase.status === 'completed' && (
                                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                                    Completed
                                  </span>
                                )}
                                {phase.status === 'in-progress' && (
                                  <span className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs">
                                    In Progress
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{phase.description}</p>
                              <div className="mt-4">
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500
                                      ${phase.status === 'completed' ? 'bg-green-500' :
                                        phase.status === 'in-progress' ? 'bg-indigo-500' :
                                        'bg-gray-300'}`}
                                    style={{ width: `${phase.progress}%` }}
                                  />
                                </div>
                                <div className="mt-2 flex justify-between text-sm text-gray-500">
                                  <span>{phase.progress}% Complete</span>
                                  {phase.status !== 'locked' && (
                                    <button 
                                      className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePhaseClick(phase.id);
                                      }}
                                    >
                                      <span>{activePhase === phase.id ? 'Hide Details' : 'Continue'}</span>
                                      <ChevronRight className={`w-4 h-4 transition-transform ${activePhase === phase.id ? 'rotate-90' : ''}`} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {activePhase === phase.id && selectedProject && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-100 p-4 sm:p-6"
                          >
                            <phase.component projectId={selectedProject.id} />
                            <TaskTracking projectId={selectedProject.id} />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {activeTab === 'points' && <PointsDisplay />}
      {activeTab === 'achievements' && <AchievementsShowcase />}
      {activeTab === 'rewards' && <RewardsStore />}
    </div>
  );
}