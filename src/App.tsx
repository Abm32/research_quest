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
import AnalysisSuite from './components/AnalysisSuite';
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
  setIsOpen: () => { },
  lastActivity: '',
  updateActivity: () => { }
});

// Create context for user activity and research progress
const ResearchContext = createContext<{
  currentTopics: string[];
  recentActivities: Array<{ id: number, action: string, timestamp: string, resource: string }>;
  progress: number;
  addTopic: (topic: string) => void;
  removeTopic: (topic: string) => void;
}>({
  currentTopics: [],
  recentActivities: [],
  progress: 0,
  addTopic: () => { },
  removeTopic: () => { }
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
  const [recentActivities, setRecentActivities] = useState<Array<{ id: number, action: string, timestamp: string, resource: string }>>([]);
  const [progress, setProgress] = useState(25);

  const updateActivity = (activity: string) => {
    setLastActivity(activity);
  };

  const addTopic = (topic: string) => {
    setCurrentTopics(prev => [...new Set([...prev, topic])]);
  };

  const removeTopic = (topic: string) => {
    setCurrentTopics(prev => prev.filter(t => t !== topic));
  };

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
            <div className="flex flex-col min-h-screen bg-slate-50">
              <Navbar />
              <main className="flex-grow">
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route
                      path="/research-journey"
                      element={
                        <PrivateRoute>
                          <div className="container mx-auto px-4 py-8">
                            <ResearchJourney />
                          </div>
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
                      path="/profile-setup"
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
                      path="/joined-communities"
                      element={
                        <PrivateRoute>
                          <JoinedCommunities />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/community-chat/:id"
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
                      path="/research-tips"
                      element={
                        <PrivateRoute>
                          <ResearchTips />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/methodology"
                      element={
                        <PrivateRoute>
                          <MethodologyExplorer />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/investigation-tools"
                      element={
                        <PrivateRoute>
                          <InvestigationTools />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/analysis-suite"
                      element={
                        <PrivateRoute>
                          <AnalysisSuite />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </PageTransition>
              </main>
              <Footer />
              <FloatingResearchAssistant
                isOpen={isAIAssistantOpen}
                onClose={() => setIsAIAssistantOpen(false)}
                context="You are a helpful research assistant. You can help users with their research journey, including topic selection, methodology, and analysis."
                placeholder="Ask me anything about your research..."
                suggestedPrompts={[
                  { text: "Help me find a research topic", category: "topic" },
                  { text: "What research methodology should I use?", category: "methodology" },
                  { text: "How can I analyze my research data?", category: "analysis" }
                ]}
              />
            </div>
          </Router>
        </ResearchContext.Provider>
      </AIAssistantContext.Provider>
    </AuthProvider>
  );
}

export default App;