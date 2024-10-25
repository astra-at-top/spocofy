import { fetchPlaylists } from "../Store/Reducer/PlaylistReducer"
import { useEffect } from 'react';
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from "../Store/store"
import { Link } from 'react-router-dom';

function Dashboardhome() {
    const dispatch = useDispatch<AppDispatch>()
    const playlists = useAppSelector(state => state.playlist.playlists)

    useEffect(() => {
        dispatch(fetchPlaylists())
    }, [dispatch])

    return (
        <div className="p-6 font-firacode">
            <h1 className="text-3xl font-bold text-purple-400 mb-8">Welcome to Spocofy</h1>
            <div className="hero-section bg-purple-500 text-white p-8 shadow-lg mb-8">
                <h2 className="text-4xl font-bold mb-4">Discover Your Next Favorite Song</h2>
                <p className="text-lg mb-4">Explore millions of songs and create your own playlists with Spocofy.</p>
                <Link to="/search" className="bg-white text-purple-500 px-4 py-2 font-semibold hover:bg-gray-200 transition-colors duration-200">
                    Start Searching
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold text-white mb-4">Your Playlists</h2>
                    <ul className="space-y-2">
                        {playlists.slice(0, 5).map((playlist) => (
                            <li key={playlist._id} className="bg-gray-700 p-4">
                                <Link to={`/playlist/${playlist._id}`} className="text-purple-300 hover:text-purple-500 transition-colors duration-200">
                                    {playlist.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link to="/playlist" className="mt-4 inline-block text-purple-400 hover:text-purple-600 transition-colors duration-200">
                        View all playlists
                    </Link>
                </div>
                <div className="bg-gray-800 p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <Link to="/search" className="block bg-gray-700 p-4 text-purple-300 hover:text-purple-500 transition-colors duration-200">
                            Search for music
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboardhome