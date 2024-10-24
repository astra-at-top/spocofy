import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Store/Reducer/AuthpageReducer';
import { AppDispatch } from '../Store/store';

interface HeaderProps {
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({setIsSidebarOpen}) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout(navigate));
    };

    return (
        <header className="bg-gray-950 border-s border-gray-900 border-b border-gray-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
          
                <button 
                    className="md:hidden mr-4 text-white hover:text-purple-400 transition-colors duration-200 "
                    onClick={() => {
                        
                        setIsSidebarOpen(true)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
            <div className="flex items-center">
                <button 
                    onClick={handleLogout}
                    className="bg-[#282828] text-white font-bold py-2 px-4  hover:bg-opacity-80 transition-colors duration-200"
                >
                    Log out
                </button>
            </div>
        </header>
    );
};

export default Header;
