import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosAuthInstance } from '../../Axios/Axios';

interface Playlist {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  owner: string;
  songs: string[];
}

interface PlaylistState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
}

const initialState: PlaylistState = {
  playlists: [],
  loading: false,
  error: null,
};

export const createPlaylist = createAsyncThunk(
  'playlists/createPlaylist',
  async (playlistData: { name: string; description: string; coverImage: string , showToast : () => void }, { rejectWithValue }) => {
    try {
      const response = await axiosAuthInstance.post('/playlist/', playlistData);
      if(playlistData.showToast){
        playlistData.showToast()
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while creating the playlist');
    }
  }
);

export const fetchPlaylists = createAsyncThunk(
  'playlists/fetchPlaylists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAuthInstance.get('/playlist/');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while fetching playlists');
    }
  }
);

export const addSongToPlaylist = createAsyncThunk(
  'playlists/addSongToPlaylist',
  async ({ playlistId, songData , showToast }: { playlistId: string; songData: any ,showToast : () => void }, { rejectWithValue }) => {
    try {
      const response = await axiosAuthInstance.post(`/playlist/${playlistId}/songs`, { songData });
      if(showToast){
        showToast()
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while adding the song to the playlist');
    }
  }
);

export const removeSongFromPlaylist = createAsyncThunk(
  'playlists/removeSongFromPlaylist',
  async ({ playlistId, songId, showToast }: { playlistId: string; songId: string; showToast: () => void }, { rejectWithValue }) => {
    try {
      const response = await axiosAuthInstance.delete(`/playlist/${playlistId}/songs`, { data: { songId } });
      if (showToast) {
        showToast();
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while removing the song from the playlist');
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  'playlists/deletePlaylist',
  async ({id , deleteToast} : {id : string; deleteToast : () => void }, { rejectWithValue }) => {
    try {
      await axiosAuthInstance.delete(`/playlist/${id}`);
      if(deleteToast){
        deleteToast()
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while deleting the playlist');
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  'playlists/updatePlaylist',
  async ({ id, playlistData, showToast }: { id: string; playlistData: Partial<Playlist>; showToast: () => void }, { rejectWithValue }) => {
    try {
        console.log(playlistData,"playlistData")
      const response = await axiosAuthInstance.put(`/playlist/${id}`, playlistData);
      if (showToast) {
        showToast();
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while updating the playlist');
    }
  }
);

const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists.push(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addSongToPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSongToPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPlaylist = action.payload.playlist;
        console.log(action.payload,"payloads")
        const index = state.playlists.findIndex(playlist => playlist._id === updatedPlaylist._id);
        if (index !== -1) {
          state.playlists[index] = updatedPlaylist;
        }
      })
      .addCase(addSongToPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeSongFromPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSongFromPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPlaylist = action.payload;
        const index = state.playlists.findIndex(playlist => playlist._id === updatedPlaylist._id);
        if (index !== -1) {
          state.playlists[index] = updatedPlaylist;
        }
      })
      .addCase(removeSongFromPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = state.playlists.filter(playlist => playlist._id !== action.payload);
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPlaylist = action.payload;
        const index = state.playlists.findIndex(playlist => playlist._id === updatedPlaylist._id);
        if (index !== -1) {
          state.playlists[index] = updatedPlaylist;
        }
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setError } = playlistSlice.actions;

export default playlistSlice.reducer;
