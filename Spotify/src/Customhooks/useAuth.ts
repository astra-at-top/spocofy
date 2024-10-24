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
      dispatch(setLoading(true)); 
      try {
        await axiosAuthInstance.get('/auth/verify');
        dispatch(setAuthenticated(true));
      } catch (error) {
        localStorage.removeItem("token");
        dispatch(setAuthenticated(false));
      } finally {
        dispatch(setLoading(false))
      }
    };
    checkAuth();
  }, [dispatch]);

  return { isAuthenticated, isLoading };
}