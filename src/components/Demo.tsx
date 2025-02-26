import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Info,
  Download,
  Bookmark,
  Share2,
  ChevronRight,
  Check,
  ArrowRight,
  MessageSquare,
  Eye,
  Mail,
  Users,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface DemoVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  views: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  features: string[];
  relatedVideos: RelatedVideo[];
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
}

interface RelatedVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Export as named export to match the import in App.tsx
export const Demo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0); 
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'resources'>('overview');
  
  // Current date/time (formatted as YYYY-MM-DD HH:MM:SS)
  const [currentDateTime, setCurrentDateTime] = useState<string>("2025-02-26 13:03:57");
  
  // User state from Firebase
  const [userLogin, setUserLogin] = useState<string>("Abm32");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user from Firebase
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        // Use displayName if available, otherwise use email or uid
        setUserLogin(user.displayName || user.email?.split('@')[0] || "Abm32");
      } else {
        // If no user is logged in, fallback to default
        setUserLogin("Abm32");
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);
  
  // Sample data for the main demo video
  const demoVideo: DemoVideo = {
    id: 'demo-1',
    title: 'Getting Started with Research Quest: First Investigation',
    description: 'This guided demo walks through setting up your first research investigation, navigating resources, and collaborating with peers. Perfect for beginners looking to kickstart their research journey.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
    videoUrl: '#',
    duration: '11:24',
    views: 2457,
    category: 'Getting Started',
    difficulty: 'Beginner',
    features: [
      'Interactive step-by-step guide',
      'Hands-on research methodology practice',
      'Real-world investigation examples',
      'Built-in collaboration tools demo',
      'Resource discovery techniques'
    ],
    relatedVideos: [
      {
        id: 'related-1',
        title: 'Advanced Search Techniques for Academic Papers',
        thumbnailUrl: 'https://images.unsplash.com/photo-1484069560501-87d72b0c3669',
        duration: '7:45',
        difficulty: 'Intermediate'
      },
      {
        id: 'related-2',
        title: 'Setting Up Your Research Portfolio',
        thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
        duration: '5:23',
        difficulty: 'Beginner'
      },
      {
        id: 'related-3',
        title: 'Collaborative Research Methods',
        thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
        duration: '9:16',
        difficulty: 'Intermediate'
      }
    ],
    instructor: {
      name: 'Dr. Emily Chen',
      title: 'Research Methodologist',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    }
  };

  // Mock transcript data
  const transcriptData = [
    { time: '0:00', text: "Welcome to Research Quest! In this demo, we'll walk through how to set up your first investigation." },
    { time: '0:32', text: "First, let's navigate to the dashboard and click on 'New Investigation'." },
    { time: '1:15', text: "Here you can select your research topic area or create a custom investigation." },
    { time: '2:08', text: "The platform will guide you through defining your research question and methodology." },
    { time: '3:42', text: "Notice how you can invite collaborators directly from this screen." },
    { time: '4:37', text: "Let's explore the resource finder to locate relevant academic papers and datasets." },
    { time: '6:10', text: "The AI-powered assistant can help summarize papers and extract key information." },
    { time: '7:23', text: "Now we'll set up our first data collection form using the integrated tools." },
    { time: '9:01', text: "Your progress is automatically tracked, and you earn points as you complete each step." },
    { time: '10:14', text: "Finally, let's look at how to share your findings and export your research data." }
  ];
  
  // Calculate progress percentage for the video scrubber
  const totalSeconds = 11 * 60 + 24; // 11:24 in seconds
  const progressPercentage = (currentTime / totalSeconds) * 100;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const handleForward = () => {
    setCurrentTime(Math.min(totalSeconds, currentTime + 10));
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value, 10);
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-amber-100 text-amber-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-sm text-gray-500 hover:text-teal-700">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link to="/demos" className="ml-1 text-sm text-gray-500 hover:text-teal-700">
                  Demos
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-800">
                  {demoVideo.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video Content - Takes up 2/3 of the space on larger screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
            {/* Video Thumbnail/Player */}
            <div className="relative aspect-video bg-gray-900">
              <img 
                src={demoVideo.thumbnailUrl} 
                alt={demoVideo.title}
                className="w-full h-full object-cover opacity-70"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-teal-600 bg-opacity-90 p-4 rounded-full text-white shadow-lg"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </motion.button>
              </div>
              
              {/* Current Time Indicator */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-sm">
                {formatTime(currentTime)} / {demoVideo.duration}
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="bg-gray-900 p-4 text-white">
              <div className="flex items-center mb-2">
                <input
                  type="range"
                  min="0"
                  max={totalSeconds}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, teal ${progressPercentage}%, #374151 0%)`,
                  }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button onClick={handleRewind} className="p-1 hover:text-teal-400 transition-colors">
                    <SkipBack className="h-5 w-5" />
                  </button>
                  <button onClick={handlePlayPause} className="p-1 hover:text-teal-400 transition-colors">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button onClick={handleForward} className="p-1 hover:text-teal-400 transition-colors">
                    <SkipForward className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setShowTranscript(!showTranscript)}
                    className={`p-1 ${showTranscript ? 'text-teal-400' : 'hover:text-teal-400 transition-colors'}`}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                  <button className="p-1 hover:text-teal-400 transition-colors">
                    <Download className="h-5 w-5" />
                  </button>
                  <button className="p-1 hover:text-teal-400 transition-colors">
                    <Bookmark className="h-5 w-5" />
                  </button>
                  <button className="p-1 hover:text-teal-400 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Video Title and Metadata */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{demoVideo.title}</h1>
            <div className="flex flex-wrap items-center mt-2 text-gray-600 text-sm gap-x-4 gap-y-2">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" /> 
                {demoVideo.views.toLocaleString()} views
              </span>
              <span>
                Updated: {currentDateTime}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(demoVideo.difficulty)}`}>
                {demoVideo.difficulty}
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {demoVideo.category}
              </span>
            </div>
          </div>
          
          {/* Instructor Info */}
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
            <img 
              src={demoVideo.instructor.avatar} 
              alt={demoVideo.instructor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{demoVideo.instructor.name}</h3>
              <p className="text-sm text-gray-600">{demoVideo.instructor.title}</p>
            </div>
          </div>
          
          {/* Tabs for additional content */}
          <div>
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-8" aria-label="Tabs">
                {(['overview', 'features', 'resources'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab 
                        ? 'border-teal-600 text-teal-700' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="py-4">
              {activeTab === 'overview' && (
                <div>
                                    <p className="text-gray-700">{demoVideo.description}</p>
                  
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900">What you'll learn:</h3>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" />
                        <span>How to set up your first research investigation</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" />
                        <span>Navigating the Research Quest platform efficiently</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" />
                        <span>Collaborating with peers on research projects</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" />
                        <span>Finding and organizing research resources</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900">Next steps after this demo:</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium">Create Your First Investigation</h4>
                        <p className="text-sm text-gray-600 mt-1">Put your new knowledge to use right away</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium">Join a Research Community</h4>
                        <p className="text-sm text-gray-600 mt-1">Connect with like-minded researchers</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'features' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Key Features Demonstrated</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {demoVideo.features.map((feature, index) => (
                      <div key={index} className="flex items-start bg-white p-3 rounded-lg border">
                        <div className="p-1 bg-teal-100 rounded text-teal-800 mr-3">
                          <Check className="h-4 w-4" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-semibold text-gray-900 mb-2">Platform Highlights</h3>
                    <p className="text-gray-700">
                      Research Quest combines powerful investigation tools with 
                      intuitive design to make research accessible for everyone, 
                      from beginners to advanced researchers.
                    </p>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Pro Tip for Abm32</h4>
                          <p className="text-sm text-blue-800 mt-1">
                            Based on your recent activity, you might want to explore 
                            the advanced search features shown at 7:23 in this demo.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'resources' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Additional Resources</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-white">
                      <h4 className="font-medium">Getting Started Guide</h4>
                      <p className="text-sm text-gray-600 mt-1 mb-3">
                        Comprehensive PDF guide covering all Research Quest basics
                      </p>
                      <a 
                        href="#" 
                        className="inline-flex items-center text-sm text-teal-700 hover:text-teal-900"
                      >
                        <Download className="h-4 w-4 mr-1" /> Download Guide
                      </a>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-white">
                      <h4 className="font-medium">Research Methodology Templates</h4>
                      <p className="text-sm text-gray-600 mt-1 mb-3">
                        Collection of ready-to-use templates for various research methods
                      </p>
                      <a 
                        href="#" 
                        className="inline-flex items-center text-sm text-teal-700 hover:text-teal-900"
                      >
                        <ArrowRight className="h-4 w-4 mr-1" /> Browse Templates
                      </a>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-white">
                      <h4 className="font-medium">Interactive Tutorial Series</h4>
                      <p className="text-sm text-gray-600 mt-1 mb-3">
                        Follow-up tutorials to deepen your knowledge
                      </p>
                      <a 
                        href="#" 
                        className="inline-flex items-center text-sm text-teal-700 hover:text-teal-900"
                      >
                        <Play className="h-4 w-4 mr-1" /> Start Tutorial Series
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Transcript Section - Conditionally rendered */}
          {showTranscript && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border rounded-lg overflow-hidden mt-4"
            >
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-semibold">Video Transcript</h3>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {transcriptData.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="text-sm font-medium text-gray-500 w-12">{item.time}</span>
                      <p className="text-sm text-gray-700 flex-1">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Sidebar - Takes up 1/3 of the space on larger screens */}
        <div className="space-y-6">
          {/* Related Videos */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Demos</h2>
            <div className="space-y-4">
              {demoVideo.relatedVideos.map((video) => (
                <motion.div
                  key={video.id}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="relative">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-1.5 py-0.5 rounded text-white text-xs">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity">
                      <div className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-2 shadow-lg">
                        <Play className="h-4 w-4 text-gray-800" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-teal-700 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(video.difficulty)}`}>
                        {video.difficulty}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Your Research Progress */}
          <div className="bg-gradient-to-br from-teal-700 to-blue-800 text-white rounded-lg p-5">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold">Your Progress</h2>
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                Abm32
              </span>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Research Quest Completion</span>
                <span>32%</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <div className="bg-teal-400 h-2 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Badges Earned</span>
                <span>7/24</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <div className="bg-teal-400 h-2 rounded-full" style={{ width: '29%' }} />
              </div>
            </div>
            
            <div className="mt-4 text-sm text-teal-100">
              Last activity: 2025-02-26 13:05:37
            </div>
            
            <button className="mt-4 w-full py-2 bg-white text-teal-800 rounded-lg font-medium hover:bg-teal-50 transition-colors">
              Continue Learning
            </button>
          </div>
          
          {/* Next Steps */}
          <div className="bg-white border rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Next Steps</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <Play className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Complete Beginner Series</h3>
                  <p className="text-sm text-gray-600">3 more demos in this series</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Info className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Try Interactive Tutorial</h3>
                  <p className="text-sm text-gray-600">Practice with hands-on exercises</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-teal-100 p-2 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Join Community Call</h3>
                  <p className="text-sm text-gray-600">Next call: Mar 2, 2025</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Help & Support */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Our support team is ready to assist with any questions about this demo or the Research Quest platform.
            </p>
            <div className="space-y-2">
              <a href="#" className="flex items-center text-sm text-teal-700 hover:text-teal-900">
                <MessageSquare className="h-4 w-4 mr-2" /> Chat with Support
              </a>
              <a href="#" className="flex items-center text-sm text-teal-700 hover:text-teal-900">
                <Mail className="h-4 w-4 mr-2" /> Email Questions
              </a>
              <a href="#" className="flex items-center text-sm text-teal-700 hover:text-teal-900">
                <BookOpen className="h-4 w-4 mr-2" /> View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-blue-700 to-teal-600 rounded-xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Research Journey?</h2>
          <p className="mb-6">
            Apply what you've learned in this demo and begin your first investigation with Research Quest.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="px-6 py-3 bg-white text-teal-700 font-medium rounded-lg hover:bg-teal-50 transition-colors">
              Start New Investigation
            </button>
            <button className="px-6 py-3 bg-teal-800 bg-opacity-40 text-white font-medium rounded-lg hover:bg-opacity-60 transition-colors">
              Explore More Demos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// Use both default and named export to ensure compatibility
export default Demo;