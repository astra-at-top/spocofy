import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosAuthInstance } from '../Axios/Axios';
import { logout } from '../Store/Reducer/AuthpageReducer';
import { AppDispatch } from '../Store/store';

function Dashboard() {
    const [response, setResponse] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleTestClick = async () => {
        try {
            const result = await axiosAuthInstance.post('/auth/test');
            setResponse(JSON.stringify(result.data));
        } catch (error) {
            setResponse('Error occurred');
        }
    };

    const handleLogout = () => {
        dispatch(logout(navigate));
    };

    return (
        <div className="dashboard bg-[#121212] text-white flex flex-col justify-center items-center h-screen w-screen">
            <h1 className="text-white text-6xl font-bold text-center mb-8">
                Dashboard
            </h1>
            <button 
                onClick={handleTestClick}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Test Auth
            </button>
            <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Logout
            </button>
            {response && (
                <div className="mt-4 p-4 bg-gray-800 rounded">
                    <pre>{response}</pre>
                </div>
            )}
        </div>
    );
}

export default Dashboard;