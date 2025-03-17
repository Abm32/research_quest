import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Research Hub</h3>
            <p className="text-sm md:text-base text-gray-400">Empowering researchers worldwide.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/research-journey" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">
                  Start Your Journey
                </Link>
              </li>
              <li>
                <Link to="/communities" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">
                  Explore Communities
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/analysis" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">
                  Analysis Suite
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <div className="space-y-2">
              <p className="text-sm md:text-base text-gray-400">Email: support@researchhub.com</p>
              <p className="text-sm md:text-base text-gray-400">Phone: +1 (123) 456-7890</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Research Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}