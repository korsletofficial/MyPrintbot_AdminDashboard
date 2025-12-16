import api from '../axios';

/**
 * Admin Stats API
 * Endpoints for fetching admin dashboard statistics
 */

export const statsAPI = {
  /**
   * Get admin dashboard statistics
   * @param {Object} params - Query parameters
   * @param {number} params.period - Number of days for growth calculation (default: 30)
   * @returns {Promise} Admin dashboard stats
   */
  getAdminDashboardStats: (params = {}) => {
    return api.get('/stats/admin/dashboard', { params });
  },

  /**
   * Get user growth analytics
   * @param {Object} params - Query parameters
   * @param {number} params.days - Number of days to analyze (default: 30)
   * @returns {Promise} User growth data
   */
  getUserGrowthAnalytics: (params = { days: 30 }) => {
    return api.get('/stats/admin/user-growth', { params });
  },

  /**
   * Get revenue trend
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period: 'weekly', 'monthly', 'quarterly', 'yearly' (default: 'monthly')
   * @param {number} params.range - Number of periods to show (optional)
   * @returns {Promise} Revenue trend data
   */
  getRevenueTrend: (params = { period: 'monthly' }) => {
    return api.get('/stats/admin/revenue-trend', { params });
  },

  /**
   * Get job status breakdown
   * @returns {Promise} Job status distribution
   */
  getJobStatusBreakdown: () => {
    return api.get('/stats/jobs/breakdown');
  },

  /**
   * Get response status breakdown
   * @returns {Promise} Response status distribution
   */
  getResponseStatusBreakdown: () => {
    return api.get('/stats/responses/breakdown');
  },
};

export default statsAPI;
