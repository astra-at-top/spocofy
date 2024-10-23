import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosAuthInstance } from '../Axios/Axios';
import { setAuthenticated, setLoading } from '../Store/Reducer/AuthpageReducer';
import { RootState } from '../Store/store'; // Assuming you have a RootState type defined

export function useAuth() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.auth.loading);

  useLayoutEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true)); // Set isLoading to true at the start
      try {
        // First, try to verify the existing token
        await axiosAuthInstance.get('/auth/verify');
        dispatch(setAuthenticated(true));
      } catch (error) {
        // If token verification fails, try to refresh the token
        localStorage.removeItem("token");
          dispatch(setAuthenticated(false));
      } finally {
        dispatch(setLoading(false)); // Set isLoading back to false when done
      }
    };
    checkAuth();
  }, [dispatch]);

  return { isAuthenticated, isLoading };
}