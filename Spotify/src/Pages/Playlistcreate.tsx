import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createPlaylist , setError } from '../Store/Reducer/PlaylistReducer';
import { AppDispatch } from '../Store/store';
import { RootStates } from '../Store/Rootreducer';

interface PlaylistFormInputs {
  name: string;
  description: string;
  coverImage: string;
}

const PlaylistCreate: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PlaylistFormInputs>();
  const dispatch = useDispatch<AppDispatch>();
  const playlistError = useSelector((state: RootStates) => state.playlist.error);

  const onSubmit: SubmitHandler<PlaylistFormInputs> = async (data) => {
      await dispatch(createPlaylist(data));
  };

 useEffect(() => {
    if (playlistError) {
      dispatch(setError(null));
    }
 }, [dispatch]);

  return (
    <div className="max-w-md mx-auto px-4 py-8 font-firacode">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">Create New Playlist</h1>
      {playlistError && <p className="text-red-500 text-sm text-center mb-4">{playlistError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-900 p-6 shadow-lg border border-purple-600">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
          <input
            id="name"
            {...register("name", { required: "Playlist name is required" })}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            id="description"
            {...register("description", {required : "Description is required"})}
            rows={3}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>
       
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-300">Cover Image URL</label>
          <input
            id="coverImage"
            {...register("coverImage")}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
        <div>
          <button type="submit" className="w-full bg-purple-600 text-white py-2 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm">
            Create Playlist
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaylistCreate;
