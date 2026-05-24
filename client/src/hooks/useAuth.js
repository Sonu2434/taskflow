import { useSelector, useDispatch } from 'react-redux';
import { logout, loginUser, registerUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (!result.error) navigate('/dashboard');
  };

  const register = async (data) => {
    const result = await dispatch(registerUser(data));
    if (!result.error) navigate('/dashboard');
  };

  const signOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  return {
    user,
    token,
    loading,
    error,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!token,
    login,
    register,
    signOut,
  };
};

export default useAuth;
