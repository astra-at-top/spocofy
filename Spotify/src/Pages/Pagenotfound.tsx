import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 font-firacode">
      <div className="mb-6 flex gap-2">
        <img src="/Logo.svg" className="h-10 w-10" alt="Spocofy Logo" />
        <span className="text-white text-2xl font-bold">Spocofy</span>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-purple-400 mb-8">Oops! Page not found</p>
        <Link 
          to="/dashboard" 
          className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-300"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
