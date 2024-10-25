import Loading from './Loading';
import { fetchPlaylists, deletePlaylist } from "../Store/Reducer/PlaylistReducer"
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from "react-redux"
import { AppDispatch } from "../Store/store"
import { useAppSelector } from "../Store/store"
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AddPlaylist, { AddPlaylistHandle } from "../components/Addplaylist"
import DeleteModal, { DeleteModalHandle } from "../components/Deletemodal"

const Playlist = () => {
  const playlists = useAppSelector(state =>  state.playlist.playlists)
  const dispatch = useDispatch<AppDispatch>()
  const {toast} = useToast()
  const navigate = useNavigate();
  const addPlaylistRef = useRef<AddPlaylistHandle>(null);
  const deleteModalRef = useRef<DeleteModalHandle>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [playlistToDelete, setPlaylistToDelete] = useState<{ id: string, name: string } | null>(null);
  const [playlistToUpdate, setPlaylistToUpdate] = useState<{ id: string, name: string, description: string, coverImage: string } | undefined>(undefined);
  const playlistsPerPage = 12;
  
  useEffect(() => {
    if(playlists.length === 0){
      dispatch(fetchPlaylists())
    }
  },[])
  const loading = false;
  const error = null;

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const indexOfLastPlaylist = currentPage * playlistsPerPage;
  const indexOfFirstPlaylist = indexOfLastPlaylist - playlistsPerPage;
  const currentPlaylists = playlists.slice(indexOfFirstPlaylist, indexOfLastPlaylist);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDeleteClick = (id: string, name: string) => {
    setPlaylistToDelete({ id, name });
    deleteModalRef.current?.open();
  };

  const handleConfirmDelete = () => {
    if (playlistToDelete) {
      function deleteToast() {
        toast({
          title: "Playlist has been deleted",
          description: `${playlistToDelete?.name} has been deleted from the system`,
        })
      }
      dispatch(deletePlaylist({id: playlistToDelete.id, deleteToast}));
    }
  };

  const handleUpdateClick = (playlist: { id: string, name: string, description: string, coverImage: string }) => {
    setPlaylistToUpdate(playlist);
    addPlaylistRef.current?.open();
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full font-firacode">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Your Playlists</h1>
        <button 
          className="bg-purple-600 text-white py-2 px-4 hover:bg-purple-700 transition-colors duration-300"
          onClick={() => {
            setPlaylistToUpdate(undefined);
            addPlaylistRef.current?.open()
          }}
        >
          Add Playlist
        </button>
      </div>
      {playlists.length === 0 ? (
        <p className="text-gray-400 text-center">You don't have any playlists yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {currentPlaylists.map((playlist) => (
              <div key={playlist._id} className="bg-gray-800 overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 aspect-square relative">
                <img src={playlist.coverImage || '/default-playlist.png'} alt={playlist.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 p-2 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xs sm:text-sm font-semibold text-white mb-1 truncate">{playlist.name}</h2>
                      <p className="text-gray-400 text-xs">{playlist.songs.length} songs</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="text-white hover:text-purple-400 transition-colors duration-200"
                        onClick={() => handleUpdateClick({
                          id: playlist._id,
                          name: playlist.name,
                          description: playlist.description,
                          coverImage: playlist.coverImage
                        })}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        className="text-white hover:text-red-400 transition-colors duration-200" 
                        onClick={() => handleDeleteClick(playlist._id, playlist.name)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <button 
                      className="bg-purple-600 text-white text-xs py-1 px-2 sm:px-3 hover:bg-purple-700 transition-colors duration-300 w-full"
                      onClick={() => navigate(`/playlist/${playlist._id}`)}
                    >
                      Show more
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            {Array.from({ length: Math.ceil(playlists.length / playlistsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
      <AddPlaylist ref={addPlaylistRef} updateData={playlistToUpdate}/>
      <DeleteModal 
        ref={deleteModalRef}
        onConfirm={handleConfirmDelete}
        itemName={playlistToDelete?.name || ''}
      />
    </div>
  );
};

export default Playlist;
