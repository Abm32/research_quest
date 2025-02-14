import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Profile } from './components/Profile.tsx';
import { ResearchJourney } from './components/ResearchJourney.tsx';
import { Communities } from './components/Communities.tsx';
import { Resources } from './components/Resources.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/journey" element={<ResearchJourney />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;