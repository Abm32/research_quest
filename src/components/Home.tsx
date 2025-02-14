import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Users, 
  BookOpen, 
  Award,
  ArrowRight,
  Sparkles,
  Brain,
  Rocket,
  Target
} from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: Brain,
      title: 'Research Discovery',
      description: 'Find and explore research topics that match your interests.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Users,
      title: 'Community Collaboration',
      description: 'Connect with researchers across Discord, Slack, and Reddit.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Rocket,
      title: 'Resource Sharing',
      description: 'Share and discover valuable research resources.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Target,
      title: 'Gamified Learning',
      description: 'Earn points and badges as you progress in your research journey.',
      color: 'from-orange-500 to-pink-500'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
        stiffness: 100
      }
    }
  };

  return (
    <div className="space-y-16 px-4 py-8">
      <section className="text-center space-y-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 to-white rounded-3xl transform -skew-y-6"
        />
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 relative"
        >
          Collaborate on Research,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 relative">
            Earn as You Learn
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -right-8 -top-8"
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Join a community of researchers, share knowledge, and earn rewards while
          advancing your research journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link
            to="/journey"
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
              whileHover={{ scale: 1.5 }}
            />
            <span className="relative flex items-center justify-center space-x-2">
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            to="/communities"
            className="group px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Explore Communities</span>
              <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </span>
          </Link>
        </motion.div>
      </section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 rounded-xl`} />
            <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl inline-block`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
            <p className="text-gray-600 mt-2">{feature.description}</p>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Start?</h2>
          <p className="text-gray-600">
            Begin your research journey today and join our growing community of researchers.
          </p>
          <Link
            to="/journey"
            className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <span className="flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}