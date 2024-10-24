import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchSongs } from '../Store/Reducer/SpoyifyReducer';
import { RootStates } from '../Store/Rootreducer';
import AddsongtoPlaylist from '@/components/Addtoplaylist';

const SearchSong: React.FC = () => {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { searchSongsResults, loading, error } = useSelector((state: RootStates) => state.spotify);
  const addToPlaylistRef = useRef<{ open: (song: any) => void } | null>(null);

  const songsPerPage = 12;
  const totalPages = Math.ceil(searchSongsResults.length / songsPerPage);

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(searchSongs({ query }) as any);
      setCurrentPage(1);
    }
  };

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = searchSongsResults.slice(indexOfFirstSong, indexOfLastSong);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleAddToPlaylist = (song: any) => {
    if (addToPlaylistRef.current) {
      addToPlaylistRef.current.open(song);
    }
  };

  return (
    <div className="container mx-auto md:px-4 py-8 font-firacode overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-center mb-8">
        <input
          type="text"
          placeholder="Search for songs ..."
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 px-4 py-2 border-2 border-gray-700 focus:outline-none focus:border-purple-500 bg-gray-900 text-white h-10 mb-2 sm:mb-0 sm:mr-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          className="w-full sm:w-auto bg-purple-500 text-white px-6 h-10 hover:bg-purple-600 transition duration-300 flex items-center justify-center"
          onClick={handleSearch}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 sm:mr-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <span className="sm:hidden">Search</span>
        </button>
      </div>

      {loading && <p className="text-center text-white">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {currentSongs.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-300">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {currentSongs.map((song) => (
              <div key={song.id} className="bg-gray-800 shadow-md overflow-hidden transition duration-300 hover:shadow-xl relative group">
                <div className="h-32 sm:h-40 bg-gray-700 relative">
                  {song.image_url && (
                    <img src={song.image_url} alt={song.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-2">
                    <p className="text-xs mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Popularity: {song.popularity}
                    </p>
                    <p className="text-xs mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Duration: {Math.floor(song.duration_ms / 60000)}:{((song.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                    </p>
                    <button 
                      className="bg-purple-500 text-white px-2 py-1 text-xs hover:bg-purple-600 transition duration-300 flex items-center"
                      onClick={() => handleAddToPlaylist(song)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Add to Playlist
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-semibold text-gray-200 mb-1 truncate">{song.name}</h3>
                  <p className="text-xs text-gray-400 truncate flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" />
                    </svg>
                    {song.artists.join(', ')}
                  </p>
                  <p className="text-xs text-gray-500 truncate flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                    Album: {song.album}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`mx-1 px-3 py-1 mb-2 ${
                    currentPage === page
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-300 mb-2 text-center">Search the song and feel it</h2>
          <p className="text-gray-400 text-center">Enter a song title to start your musical journey</p>
        </div>
      )}
      <AddsongtoPlaylist ref={addToPlaylistRef} />
    </div>
  );
};

export default SearchSong;
