import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosAuthInstance } from '../../Axios/Axios';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: string;
  image_url : string,
  duration_ms: number,
  popularity: string | number,
  preview_url: string,
  
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  image_url:  string ;
  tracks: { items: { track: Track }[] };
}

interface SpotifyState {
  searchResults: Track[];
  currentPlaylist: Playlist | null;
  searchSongsResults: Track[];
  loading: boolean;
  error: string | null;
}

const initialState: SpotifyState = {
  searchResults: [],
  currentPlaylist: null,
  searchSongsResults: [],
  loading: false,
  error: null,
};

export const searchSongs = createAsyncThunk(
  'spotify/searchSongs',
  async ({ query, limit }: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosAuthInstance.get(`/spotify/search-songs?query=${query}${limit ? `&limit=${limit}` : ''}`);
      return response.data.data.songs;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred during song search');
    }
  }
);

const spotifySlice = createSlice({
  name: 'spotify',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSongs.fulfilled, (state, action: PayloadAction<Track[]>) => {
        state.loading = false;
        state.searchSongsResults = action.payload;
      })
      .addCase(searchSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default spotifySlice.reducer;
