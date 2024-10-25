import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from "../Store/store"

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const Playlists = useAppSelector(state => state.playlist.playlists)  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`font-firacode sidebar bg-gray-950 text-white w-64 min-h-full ${isSmallScreen ? 'fixed' : 'relative'} left-0 bottom-0 top-0 overflow-y-auto transition-all duration-300 z-20 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 `}>
      <div className="logo px-6  flex justify-between items-center border-b border-gray-800 py-4">
        <div className="flex gap-2">
          <img src='/Logo.svg' className='h-10 w-10'/>
          <h1 className="text-2xl font-bold text-purple-400">Spocofy</h1>
        </div>
        {isSmallScreen && (
          <button onClick={toggleSidebar} className="text-white hover:text-purple-400 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <nav className="py-8">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center px-6 py-2 hover:border-l-4 hover:border-purple-500 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </li>
          <li>
            <Link to="/search" className="flex items-center px-6 py-2 hover:border-l-4 hover:border-purple-500 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Link>
          </li>
          <li>
            <Link to="/playlist" className="flex items-center px-6 py-2 hover:border-l-4 hover:border-purple-500 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Playlists
            </Link>
          </li>
        </ul>
      </nav>
      <div className="playlists  border-t pt-8 border-gray-800">
        <div className="flex justify-between items-center px-6 mb-4">
          <h2 className="text-lg font-semibold text-purple-300">Recent Playlists</h2>
          
        </div>
        <ul className="space-y-2">
          {Playlists.slice(0, 5).map((playlist) => (
            <li key={playlist._id}>
              <Link to={`/playlist/${playlist._id}`} className="flex items-center px-6 py-2 hover:border-l-4 hover:border-purple-500 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                {playlist.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
