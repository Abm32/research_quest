import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  ArrowRight,
  Search,
  BookOpen,
  Share2,
  Award,
  FileText,
  Compass,
  Lightbulb,
  Map,
  BarChart2,
  Database,
  GitBranch
} from 'lucide-react';

interface Feature {
  icon: React.FC<any>;
  title: string;
  description: string;
  color: string;
}

interface Testimonial {
  name: string;
  role: string;
  comment: string;
  avatar: string;
}

interface Stat {
  value: string;
  label: string;
  icon: React.FC<any>;
}

export default function Home() {
  // Updated features with more investigative icons and descriptions
  const features: Feature[] = [
    {
      icon: Search,
      title: 'Research Discovery',
      description: 'Uncover and explore research topics that match your interests and curiosity.',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      icon: Users,
      title: 'Community Collaboration',
      description: 'Connect with fellow investigators across platforms to share insights.',
      color: 'from-blue-600 to-blue-400'
    },
    {
      icon: FileText,
      title: 'Resource Library',
      description: 'Access a curated collection of research materials and methodologies.',
      color: 'from-slate-700 to-slate-500'
    },
    {
      icon: Compass,
      title: 'Guided Exploration',
      description: 'Follow structured paths designed for beginners to develop research skills.',
      color: 'from-teal-600 to-emerald-500'
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'John Doe',
      role: 'Researcher at Stanford',
      comment: 'This platform made complex research methodologies accessible to me as a beginner. Highly recommended!',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      name: 'Jane Smith',
      role: 'PhD Candidate at MIT',
      comment: 'The guided exploration approach helps me tackle research systematically. Perfect for newcomers!',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      name: 'Alice Johnson',
      role: 'Data Scientist at Google',
      comment: 'A fantastic resource for discovering and analyzing research materials. The investigation tools are invaluable.',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
  ];

  // Updated stats with relevant icons
  const stats: Stat[] = [
    { value: '10,000+', label: 'Active Researchers', icon: Users },
    { value: '500+', label: 'Research Topics', icon: BookOpen },
    { value: '1M+', label: 'Resources Shared', icon: Share2 },
    { value: '100+', label: 'Research Communities', icon: Compass }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="space-y-20 px-6 py-12 bg-slate-50">
      <main className="flex-grow">
        <div className="space-y-20 px-6 py-12">
          {/* Hero Section with investigative elements */}
          <section className="text-center space-y-8 relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-100 to-white rounded-3xl"
            />
            
            {/* Background elements that suggest investigation */}
            <motion.div 
              className="absolute -z-5 top-10 left-10 opacity-10"
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 0.1, rotate: 0 }}
              transition={{ duration: 1 }}
            >
              <Map className="w-32 h-32 text-slate-600" />
            </motion.div>
            
            <motion.div 
              className="absolute -z-5 bottom-10 right-10 opacity-10"
              initial={{ opacity: 0, rotate: 10 }}
              animate={{ opacity: 0.1, rotate: 0 }}
              transition={{ duration: 1 }}
            >
              <Search className="w-24 h-24 text-teal-600" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-slate-800 relative"
            >
              Investigate. Discover.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 relative">
                Build Your Research Skills
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -right-8 -top-8"
                >
                  <Lightbulb className="w-6 h-6 text-amber-400" />
                </motion.div>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Begin your investigative journey with structured guidance, research tools, and a 
              community of explorers to help you develop your expertise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link
                to="/journey"
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                  whileHover={{ scale: 1.5 }}
                />
                <span className="relative flex items-center justify-center space-x-2">
                  <span>Start Investigating</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/methodologies"
                className="group px-8 py-4 border-2 border-slate-600 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Explore Methodologies</span>
                  <Compass className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </section>

          {/* Research Process Section - New addition */}
          <section className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">The Research Process</h2>
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-teal-200 transform -translate-y-1/2 hidden md:block"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { step: "1", title: "Question", icon: Lightbulb, description: "Formulate your research question" },
                  { step: "2", title: "Investigate", icon: Search, description: "Gather and analyze information" },
                  { step: "3", title: "Synthesize", icon: BookOpen, description: "Connect ideas and form conclusions" },
                  { step: "4", title: "Share", icon: Share2, description: "Present your findings to others" }
                ].map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-md border-4 border-teal-100 z-10">
                      <step.icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold mt-4 text-slate-800">{step.title}</h3>
                    <p className="text-slate-600 mt-2">{step.description}</p>
                    <div className="bg-teal-600 text-white w-6 h-6 rounded-full flex items-center justify-center absolute top-0 right-1/2 transform translate-x-8 -translate-y-1">
                      {step.step}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section with investigative color themes */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group border-t-4 border-transparent hover:border-t-4 hover:border-teal-400"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
                <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl inline-block`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mt-6 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600 mt-2">{feature.description}</p>
              </motion.div>
            ))}
          </motion.section>

          {/* Stats Section with icons */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-slate-100 to-teal-50 py-16 rounded-2xl"
          >
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2 flex flex-col items-center"
                >
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <stat.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-4xl font-bold text-slate-800">{stat.value}</h3>
                  <p className="text-slate-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Testimonials Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-6xl mx-auto space-y-12"
          >
            <h2 className="text-3xl font-bold text-center text-slate-800">Researcher Stories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-teal-400"
                >
                  <div className="flex items-center space-x-4">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-slate-100" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{testimonial.name}</h3>
                      <p className="text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-slate-600">{testimonial.comment}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Tools for Research Section - New addition */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            <h2 className="text-3xl font-bold text-center text-slate-800">Research Tools</h2>
            <p className="text-center text-slate-600 max-w-3xl mx-auto">
              Discover our suite of investigative tools designed to help you explore and analyze data with confidence.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {[
                {
                  icon: Database,
                  title: "Knowledge Database",
                  description: "Search through thousands of curated research papers and articles"
                },
                {
                  icon: BarChart2,
                  title: "Analysis Suite",
                  description: "Powerful tools to analyze and visualize your research data"
                },
                {
                  icon: GitBranch,
                  title: "Methodology Builder",
                  description: "Create and customize research plans tailored to your project"
                }
              ].map((tool, index) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:border-teal-300 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="p-3 bg-teal-50 rounded-lg w-fit mb-4">
                    <tool.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">{tool.title}</h3>
                  <p className="mt-2 text-slate-600">{tool.description}</p>
                  <Link 
                    to={`/tools/${tool.title.toLowerCase().replace(' ', '-')}`}
                    className="mt-4 inline-flex items-center text-teal-600 hover:text-teal-700"
                  >
                    <span>Explore tool</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Call-to-Action Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-slate-800 to-teal-700 p-8 rounded-2xl shadow-lg relative overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 45 }}
              animate={{ opacity: 0.05, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              className="absolute -right-10 -top-10 text-white"
            >
              <Search className="w-40 h-40" />
            </motion.div>
            
            <div className="text-center space-y-6 relative z-10">
              <h2 className="text-3xl font-bold text-white">Ready to Start Your Investigation?</h2>
              <p className="text-slate-100 max-w-2xl mx-auto">
                Begin your research journey today with structured guidance and tools designed for beginners.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/journey"
                  className="inline-block px-8 py-4 bg-white text-teal-700 font-medium rounded-xl hover:bg-teal-50 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span className="flex items-center space-x-2 justify-center">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link
                  to="/demo"
                  className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <span>Watch Demo</span>
                </Link>
              </div>
            </div>
          </motion.section>
          
{/* Research Tips Section - with click interaction */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7 }}
  className="max-w-6xl mx-auto"
>
  <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Research Tips for Beginners</h2>
  <div className="grid md:grid-cols-2 gap-8">
    {[
      {
        title: "Start with clear questions",
        content: "Define specific research questions to guide your investigation and keep your research focused.",
        expandedContent: "Creating well-defined research questions helps you stay on track and avoid common pitfalls. Try framing questions that are specific, measurable, and achievable within your timeframe. Example: Instead of 'How does climate affect plants?' try 'How does seasonal rainfall variation affect growth rates of native grasses in the Pacific Northwest?'"
      },
      {
        title: "Use multiple sources",
        content: "Cross-reference information from various credible sources to ensure accuracy and reduce bias.",
        expandedContent: "When gathering information, aim to include academic journals, books, primary sources, and reputable websites. Compare how different sources address the same topic to identify consensus views and points of disagreement. Our platform provides access to curated databases where you can find peer-reviewed resources on your topic."
      },
      {
        title: "Take structured notes",
        content: "Organize your findings with systematic note-taking to track insights and connections.",
        expandedContent: "Effective note-taking systems include the Cornell method, mind mapping, or digital tools like our built-in research notebook. Whatever system you choose, be consistent in recording source information, key points, and your own reflections. This makes pattern recognition and synthesis much easier when you begin analyzing your findings."
      },
      {
        title: "Ask for feedback",
        content: "Share your research with peers and mentors to gain different perspectives and improve.",
        expandedContent: "Getting feedback early and often helps identify blind spots in your research approach. Our platform allows you to share drafts with selected peers or mentors, or post specific questions to relevant research communities. Consider scheduling regular check-ins with a research advisor or joining a peer review group."
      },
    ].map((tip, index) => {
      // Add state for managing expansion of each tip
      const [isExpanded, setIsExpanded] = React.useState(false);
      
      return (
        <motion.div
          key={tip.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + index * 0.1 }}
          className={`flex flex-col p-4 bg-white rounded-xl border border-slate-200 cursor-pointer transition-all duration-300 ${isExpanded ? 'shadow-md' : 'hover:shadow-sm'}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start">
            <div className={`text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${isExpanded ? 'bg-teal-600' : 'bg-teal-100 text-teal-700'}`}>
              {index + 1}
            </div>
            <div className="ml-4 flex-grow">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-800">{tip.title}</h3>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className={`text-slate-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <p className="text-slate-600 mt-1">{tip.content}</p>
            </div>
          </div>
          
          {/* Expanded content */}
          <motion.div 
            className="mt-4 ml-12 text-slate-700 bg-slate-50 p-4 rounded-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
              display: isExpanded ? 'block' : 'none'
            }}
            transition={{ duration: 0.3 }}
          >
            <p>{tip.expandedContent}</p>
            
            {/* Example resource relevant to the tip */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              <h4 className="text-sm font-medium text-teal-700">Recommended Resource:</h4>
              <Link 
                to={`/resources/${index + 1}`}
                onClick={(e) => e.stopPropagation()} 
                className="text-sm text-blue-600 hover:underline flex items-center mt-1"
              >
                {index === 0 && "How to Formulate Effective Research Questions"}
                {index === 1 && "Guide to Evaluating Research Sources"}
                {index === 2 && "Digital Note-Taking Systems for Researchers"}
                {index === 3 && "Building Your Research Feedback Network"}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      );
    })}
  </div>
  <div className="mt-8 text-center">
    <Link 
      to="/tips"
      className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
    >
      <span>View all research tips</span>
      <ArrowRight className="w-4 h-4 ml-1" />
    </Link>
  </div>
</motion.section>
        </div>
      </main>
    </div>
  );
}