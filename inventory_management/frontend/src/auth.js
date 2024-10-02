export const isAuthenticated = () => {
    return sessionStorage.getItem('username') !== null;  // or check for token
  };
  
  export const login = (userData) => {
    sessionStorage.setItem('username', userData.name);
    sessionStorage.setItem('position', userData.position);
  };
  
  export const logout = () => {
    sessionStorage.removeItem('username');
    // Also remove tokens if stored
  };
  