/**
 * Development Auth Helper
 * Provides utilities for testing admin dashboard with mock authentication
 */

export const devAuth = {
  /**
   * Set a development token for testing
   * @param {string} token - JWT token from backend
   */
  setToken: (token) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('token', token);
    console.log('✅ Development token set successfully');
  },

  /**
   * Clear all tokens
   */
  clearToken: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    console.log('✅ Tokens cleared');
  },

  /**
   * Get current token
   */
  getToken: () => {
    return localStorage.getItem('admin_token') || 
           localStorage.getItem('token') || 
           sessionStorage.getItem('token');
  },

  /**
   * Check if token exists
   */
  hasToken: () => {
    return !!devAuth.getToken();
  }
};

// Make it available globally for easy console access
if (typeof window !== 'undefined') {
  window.devAuth = devAuth;
}

export default devAuth;
