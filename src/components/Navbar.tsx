import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Home, 
  User, 
  Map, 
  Users, 
  BookOpen, 
  LogIn 
} from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const user = useStore((state) => state.user);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/journey', icon: Map, label: 'Research Journey' },
    { path: '/communities', icon: Users, label: 'Communities' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <span className="font-bold text-xl">ResearchHub</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium
                  ${location.pathname === item.path
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">{user.name}</span>
              </Link>
            ) : (
              <button className="flex items-center space-x-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50">
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}