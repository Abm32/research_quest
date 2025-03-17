import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { auth } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { path: '/communities', label: 'Communities' },
    { path: '/resources', label: 'Resources' },
    { path: '/journey', label: 'Research Journey' },
    { path: '/analysis', label: 'Analysis Suite' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Heads&Tails</span>
            </Link>
            
            {/* Desktop Navigation */}
            {user && (
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                      isActive(item.path)
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {user ? (
              <>
                {/* Desktop Actions */}
                <div className="hidden md:flex md:items-center md:space-x-4">
                  <button className="p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-gray-100">
                    <Search className="h-6 w-6" />
                  </button>
                  <button className="p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-gray-100 relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                  </button>
                  
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || ''}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.displayName?.split(' ')[0]}
                    </span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50"
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
                  >
                    {isMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || ''}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <div className="text-base font-medium text-gray-800">
                    {user.displayName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                >
                  Your Profile
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}