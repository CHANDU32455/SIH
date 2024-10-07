export const isAuthenticated = () => {
    return sessionStorage.getItem('username') !== null;
  };
  
  export const login = (userData) => {
    sessionStorage.setItem('username', userData.name);
    sessionStorage.setItem('position', userData.position);
  };
  
  export const logout = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('position');
    // Also remove tokens if stored
  };
  