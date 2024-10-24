import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, AppDispatch } from "@/Store/store";
import { useDispatch } from "react-redux";
import { fetchPlaylists, deletePlaylist, removeSongFromPlaylist } from "@/Store/Reducer/PlaylistReducer";
import { useToast } from '@/hooks/use-toast';
import Loading from './Loading';
import DeleteModal, { DeleteModalHandle } from '@/components/Deletemodal';

const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const playlists = useAppSelector(state => state.playlist.playlists);
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const deleteModalRef = useRef<DeleteModalHandle>(null);
  const [songToDelete, setSongToDelete] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    if (playlists.length === 0) {
      dispatch(fetchPlaylists());
    } else {
      const foundPlaylist = playlists.find(p => p._id === id);
      setPlaylist(foundPlaylist);
      setLoading(false);
    }
  }, [dispatch, id, playlists]);

  const handleDeleteClick = () => {
    deleteModalRef.current?.open();
  };

  const handleConfirmDelete = () => {
    if (id) {
      dispatch(deletePlaylist({
        id,
        deleteToast: () => {
          toast({
            title: "Playlist has been deleted",
            description: `${playlist?.name} has been deleted from the system`,
          });
          navigate('/dashboard/playlist');
        }
      }));
    }
  };

  const handleRemoveSong = (songId: string, songName: string) => {
    setSongToDelete({ id: songId, name: songName });
    deleteModalRef.current?.open();
  };

  const handleConfirmRemoveSong = () => {
    if (id && songToDelete) {
      dispatch(removeSongFromPlaylist({
        playlistId: id,
        songId: songToDelete.id,
        showToast: () => {
          toast({
            title: "Song removed",
            description: "The song has been removed from the playlist",
          });
        }
      }));
      setSongToDelete(null);
    }
  };

  if (loading) return <Loading />;
  if (!playlist) return <div className="text-white text-center">Playlist not found</div>;

  return (
    <div className="h-full bg-gradient-to-b from-purple-900 via-gray-800 to-black text-white font-firacode">
      <div className="container mx-auto py-4 sm:py-8 relative">
        <div className="flex justify-between items-center mb-4">
          <button 
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-4 rounded-full shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            onClick={() => navigate('/dashboard/playlist')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back</span>
          </button>
          <button 
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded-full shadow-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            onClick={handleDeleteClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
          <img src={playlist.coverImage || '/default-playlist.png'} alt={playlist.name} className="w-32 h-32 sm:w-48 sm:h-48 object-cover shadow-xl rounded-lg" />
          <div className="text-center sm:text-left">
            <h2 className="text-xs sm:text-sm uppercase tracking-wider mb-1 sm:mb-2">Playlist</h2>
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">{playlist.name}</h1>
            <p className="text-gray-400 text-xs sm:text-sm"><span>{playlist.songs.length} songs • Created by You</span></p>
          </div>
        </div>

        <div className="bg-opacity-30 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-left">
                <th className="py-2 px-2 sm:py-3 sm:px-3">#</th>
                <th className="py-2 px-2 sm:py-3 sm:px-3">Title</th>
                <th className="py-2 px-2 sm:py-3 sm:px-3 hidden sm:table-cell">Album</th>
                <th className="py-2 px-2 sm:py-3 sm:px-3">Duration</th>
                <th className="py-2 px-2 sm:py-3 sm:px-3 hidden md:table-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {playlist.songs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-3 text-gray-400">This playlist is empty.</td>
                </tr>
              ) : (
                playlist.songs.map((song: any, index: number) => (
                  <tr key={song.id || index} className="hover:bg-purple-900 hover:bg-opacity-30 transition duration-300">
                    <td className="py-2 px-2 sm:py-3 sm:px-3">{index + 1}</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-3">
                      <div className="flex items-center">
                        <img src={song.image_url || '/default-album.jpg'} alt={song.name} className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 rounded" />
                        <div>
                          <p className="font-semibold text-xs sm:text-sm">{song.name}</p>
                          <p className="text-gray-400 text-xs">{song.artists.join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-400 hidden sm:table-cell text-xs sm:text-sm">{song.album}</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-400 text-xs sm:text-sm">
                      {Math.floor(song.duration_ms / 60000)}:{Math.floor((song.duration_ms % 60000) / 1000).toString().padStart(2, '0')}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-400 hidden md:table-cell text-xs sm:text-sm flex justify-center">
                      <button 
                        className="text-red-500 hover:text-red-700 transition-colors duration-200 transform hover:scale-110"
                        onClick={() => {
                          console.log('Song ID:', song.id, 'Song Name:', song.name , song);
                          handleRemoveSong(song.spotifyId, song.name);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteModal 
        ref={deleteModalRef}
        onConfirm={songToDelete ? handleConfirmRemoveSong : handleConfirmDelete}
        itemName={songToDelete ? songToDelete.name : playlist?.name || ''}
      />
    </div>
  );
};

export default PlaylistDetail;
