import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search,
  Pencil,
  Code,
  ClipboardCheck,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { DiscoveryPhase } from './InteractiveResearchJourney/DiscoveryPhase';
import { DesignPhase } from './InteractiveResearchJourney/DesignPhase';
import { DevelopmentPhase } from './InteractiveResearchJourney/DevelopmentPhase';
import { EvaluationPhase } from './InteractiveResearchJourney/EvaluationPhase';

export default function ResearchJourney() {
  const [activePhase, setActivePhase] = React.useState<string | null>(null);

  const phases = [
    {
      id: 'discovery',
      icon: Search,
      title: 'Discovery',
      description: 'Find and explore research topics that match your interests.',
      progress: 100,
      status: 'completed',
      component: DiscoveryPhase
    },
    {
      id: 'design',
      icon: Pencil,
      title: 'Design',
      description: 'Plan your research methodology and approach.',
      progress: 60,
      status: 'in-progress',
      component: DesignPhase
    },
    {
      id: 'development',
      icon: Code,
      title: 'Development',
      description: 'Conduct your research and collect data.',
      progress: 0,
      status: 'locked',
      component: DevelopmentPhase
    },
    {
      id: 'evaluation',
      icon: ClipboardCheck,
      title: 'Evaluation',
      description: 'Analyze results and publish findings.',
      progress: 0,
      status: 'locked',
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-gray-900">Your Research Journey</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your progress through each phase of your research journey. Complete tasks,
          earn points, and unlock achievements along the way.
        </p>
      </motion.div>

      <div className="space-y-6">
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
              className={`p-6 cursor-pointer transition-colors
                ${phase.status !== 'locked' ? 'hover:bg-gray-50' : ''}
                ${activePhase === phase.id ? 'bg-gray-50' : ''}`}
              onClick={() => phase.status !== 'locked' && handlePhaseClick(phase.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg
                  ${phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                    phase.status === 'in-progress' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-gray-100 text-gray-600'}`}
                >
                  <phase.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{phase.title}</h3>
                    {phase.status === 'completed' && (
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                        Completed
                      </span>
                    )}
                    {phase.status === 'in-progress' && (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-gray-600">{phase.description}</p>
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
            {activePhase === phase.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-100"
              >
                <phase.component />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <Link
          to="/communities"
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <span>Connect with Research Communities</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}