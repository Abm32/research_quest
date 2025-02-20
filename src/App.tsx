import React, { createContext, useContext, useState } from 'react';
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
import Footer from './components/Footer';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { FloatingResearchAssistant } from './components/AIChat/FloatingResearchAssistant';

// Create context for AI Assistant state
const AIAssistantContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

// Custom hook for using AI Assistant context
export const useAIAssistant = () => useContext(AIAssistantContext);

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const suggestedPrompts = [
    {
      text: "How can I improve my research methodology?",
      category: "methodology"
    },
    {
      text: "What are some effective ways to analyze my research data?",
      category: "analysis"
    },
    {
      text: "Can you help me find relevant research papers for my topic?",
      category: "literature"
    }
  ];

  return (
    <AuthProvider>
      <AIAssistantContext.Provider value={{ isOpen: isAIAssistantOpen, setIsOpen: setIsAIAssistantOpen }}>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
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
              </Routes>
            </main>
            <Footer />
            <FloatingResearchAssistant
              context="You are a comprehensive research assistant, capable of helping with methodology, literature review, data analysis, and general research guidance."
              placeholder="Ask me anything about your research..."
              suggestedPrompts={suggestedPrompts}
              position="bottom-right"
              isOpen={isAIAssistantOpen}
              onClose={() => setIsAIAssistantOpen(false)}
            />
          </div>
        </Router>
      </AIAssistantContext.Provider>
    </AuthProvider>
  );
}

export default App;