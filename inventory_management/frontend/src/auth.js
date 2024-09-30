export const isAuthenticated = () => {
    return sessionStorage.getItem('username') !== null;  // or check for token
  };
  
  export const login = (userData) => {
    sessionStorage.setItem('username', userData.username);
    // If using tokens, store token in session storage
  };
  
  export const logout = () => {
    sessionStorage.removeItem('username');
    // Also remove tokens if stored
  };
  