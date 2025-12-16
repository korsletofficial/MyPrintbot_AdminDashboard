import api from '../axios';

export const authAPI = {
  /**
   * Admin login
   * @param {Object} credentials - { email, password }
   * @returns {Promise} Login response with user and token
   */
  login: (credentials) => api.post('/auth/signin', credentials),

  /**
   * Logout current admin
   * @returns {Promise} Logout response
   */
  logout: () => api.post('/auth/logout'),

  /**
   * Get current admin user
   * @returns {Promise} Current user data
   */
  getCurrentUser: () => api.get('/users/me'),

  /**
   * Forgot password
   * @param {string} email - Admin email
   * @returns {Promise} Password reset response
   */
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Password change response
   */
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { 
      currentPassword, 
      newPassword 
    }),
};

export default authAPI;
