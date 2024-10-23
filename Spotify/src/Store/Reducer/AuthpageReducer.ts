import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance , axiosAuthInstance } from '../../Axios/Axios';
import axios from 'axios';
import { NavigateFunction } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
  } | null;
  loading: boolean;
  error: ErrorResponse | null;
}
interface ErrorResponse {
    message: string;
}
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, navigate }: { email: string; password: string; navigate: NavigateFunction }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      navigate('/dashboard'); 
      return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue({
              message: error.response.data.message || 'An error occurred during login',
            });
        }
        return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password, navigate }: { email: string; password: string; navigate: NavigateFunction }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/signup', { email, password });
      navigate('/login'); 
      return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue({
                message : error.response.data.message || 'An error occurred during signup'
            });
        }
        return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (navigate: NavigateFunction, { rejectWithValue }) => {
    try {
      await axiosAuthInstance.post('/auth/logout');
      localStorage.removeItem('token');
      navigate('/login');
      return null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'An error occurred during logout',
        });
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<{ email: string } | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.accessToken);
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        localStorage.removeItem('token')
        state.loading = false;
        state.error = action.payload as ErrorResponse;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, _ ) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ErrorResponse;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem('token')
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ErrorResponse;
      });
  },
});

export const { setAuthenticated, setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
