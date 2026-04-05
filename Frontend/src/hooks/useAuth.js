import { useSelector } from 'react-redux';

/**
 * Custom hook to manage authentication state
 * @returns {Object} Current auth state and status
 */
const useAuth = () => {
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
    isLoggedIn: isAuthenticated && user !== null,
  };
};

export default useAuth;
