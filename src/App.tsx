import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Communities from './components/Communities';
import JoinedCommunities from './components/JoinedCommunities';
import CommunityChat from './components/CommunityChat';
import Resources from './components/Resources';
import Profile from './components/Profile';
import { ProfileSetup } from './components/ProfileSetup';
import ResearchJourney from './components/ResearchJourney';
import ResearchTips from './components/ResearchTips';
import Footer from './components/Footer';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { FloatingResearchAssistant } from './components/AIChat/FloatingResearchAssistant';
import MethodologyExplorer from './components/MethodologyExplorer';
import InvestigationTools from './components/InvestigationTools';
import { Demo } from './components/Demo';
import { PageTransition } from './components/ui/PageTransition';

// Create context for AI Assistant state
const AIAssistantContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  lastActivity: string;
  updateActivity: (activity: string) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
  lastActivity: '',
  updateActivity: () => {}
});

// Create context for user activity and research progress
const ResearchContext = createContext<{
  currentTopics: string[];
  recentActivities: Array<{id: number, action: string, timestamp: string, resource: string}>;
  progress: number;
  addTopic: (topic: string) => void;
  removeTopic: (topic: string) => void;
}>({
  currentTopics: [],
  recentActivities: [],
  progress: 0,
  addTopic: () => {},
  removeTopic: () => {}
});

// Custom hook for using AI Assistant context
export const useAIAssistant = () => useContext(AIAssistantContext);

// Custom hook for research context
export const useResearch = () => useContext(ResearchContext);

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-t-teal-600 border-slate-200 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your research environment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [lastActivity, setLastActivity] = useState("Browsing the research platform");
  const [currentTopics, setCurrentTopics] = useState<string[]>([]);
  const [recentActivities, setRecentActivities] = useState<Array<{id: number, action: string, timestamp: string, resource: string}>>([]);
  const [progress, setProgress] = useState(25);
  const { user } = useAuth();
  
  // Dynamic research assistant prompts based on user context
  const suggestedPrompts = [
    {
      text: "How can I structure my research investigation?",
      category: "methodology"
    },
    {
      text: "What analysis methods would work for my collected data?",
      category: "analysis"
    },
    {
      text: "Help me find credible sources for my investigation",
      category: "literature"
    },
    {
      text: user ? `Suggest next steps for my "${currentTopics[0] || 'research'}" investigation` : "Suggest a research topic to investigate",
      category: "guidance"
    }
  ];
  
  // Research context functions
  const addTopic = (topic: string) => {
    setCurrentTopics(prev => {
      if (prev.includes(topic)) return prev;
      return [topic, ...prev].slice(0, 5);
    });
    
    // Add activity
    const newActivity = {
      id: Date.now(),
      action: "Added research topic",
      timestamp: new Date().toISOString(),
      resource: topic
    };
    setRecentActivities(prev => [newActivity, ...prev].slice(0, 10));
    
    // Update progress
    setProgress(prev => Math.min(prev + 5, 100));
  };
  
  const removeTopic = (topic: string) => {
    setCurrentTopics(prev => prev.filter(t => t !== topic));
  };
  
  // Update activity function for AI Assistant context
  const updateActivity = (activity: string) => {
    setLastActivity(activity);
    
    // Add to recent activities if significant
    if (activity.startsWith("Researching") || 
        activity.startsWith("Analyzing") || 
        activity.startsWith("Exploring")) {
      const newActivity = {
        id: Date.now(),
        action: activity,
        timestamp: new Date().toISOString(),
        resource: ""
      };
      setRecentActivities(prev => [newActivity, ...prev].slice(0, 10));
    }
  };
  
  // Initialize with some sample data when first logged in
  useEffect(() => {
    if (user && recentActivities.length === 0) {
      const currentDate = "2025-02-26T08:00:03Z";
      
      // Sample recent activities
      setRecentActivities([
        {
          id: 1,
          action: "Joined platform",
          timestamp: currentDate,
          resource: "Research Platform"
        },
        {
          id: 2,
          action: "Viewed methodology guide",
          timestamp: currentDate,
          resource: "Investigative Research Methods"
        }
      ]);
      
      // Check if we should show the assistant based on user being new
      if (!localStorage.getItem('hasSeenAssistant')) {
        setIsAIAssistantOpen(true);
        localStorage.setItem('hasSeenAssistant', 'true');
      }
    }
  }, [user]);

  return (
    <AuthProvider>
      <AIAssistantContext.Provider value={{ 
        isOpen: isAIAssistantOpen, 
        setIsOpen: setIsAIAssistantOpen,
        lastActivity,
        updateActivity
      }}>
        <ResearchContext.Provider value={{
          currentTopics,
          recentActivities,
          progress,
          addTopic,
          removeTopic
        }}>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-50">
              <Navbar />
              <PageTransition>
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/tips" element={<ResearchTips />} />
                    <Route path="/methodologies" element={<MethodologyExplorer />} />
                    <Route path="/tools/:toolId" element={<InvestigationTools />} />
                    <Route
                      path="/profile/setup"
                      element={
                        <PrivateRoute>
                          <ProfileSetup />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/communities"
                      element={
                        <PrivateRoute>
                          <Communities />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/communities/joined"
                      element={
                        <PrivateRoute>
                          <JoinedCommunities />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/communities/:communityId/chat"
                      element={
                        <PrivateRoute>
                          <CommunityChat />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/resources"
                      element={
                        <PrivateRoute>
                          <Resources />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/resources/:resourceId"
                      element={
                        <PrivateRoute>
                          <Resources />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/journey"
                      element={
                        <PrivateRoute>
                          <ResearchJourney />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/author/:authorId"
                      element={
                        <PrivateRoute>
                          <Profile isAuthor={true} />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </main>
              </PageTransition>
              <Footer />
              <FloatingResearchAssistant
                context={`You are a comprehensive research assistant for beginner investigators. 
                         The current user is ${user?.displayName || "Abm32"}. 
                         The current date and time is 2025-02-26 08:00:03. 
                         Their last research activity was: "${lastActivity}". 
                         ${currentTopics.length > 0 ? `Their current research topics include: ${currentTopics.join(', ')}.` : ''}`}
                placeholder="Ask about research methodologies, analysis, or guidance..."
                suggestedPrompts={suggestedPrompts}
                position="bottom-right"
                isOpen={isAIAssistantOpen}
                onClose={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
              />
            </div>
          </Router>
        </ResearchContext.Provider>
      </AIAssistantContext.Provider>
    </AuthProvider>
  );
}

export default App;