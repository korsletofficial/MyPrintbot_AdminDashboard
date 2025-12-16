import api from '../axios';

/**
 * Get all support queries with filters
 * @param {Object} params - Query parameters (limit, offset, status, category, priority)
 * @returns {Promise} API response with queries list
 */
export const getAllQueries = async (params = {}) => {
  const response = await api.get('/support-queries/admin/all', { params });
  return response.data;
};

/**
 * Get query by ID
 * @param {string} id - Query ID
 * @returns {Promise} API response with query details
 */
export const getQueryById = async (id) => {
  const response = await api.get(`/support-queries/admin/${id}`);
  return response.data;
};

/**
 * Update support query
 * @param {string} id - Query ID
 * @param {Object} data - Update data (status, adminNotes, priority)
 * @returns {Promise} API response
 */
export const updateQuery = async (id, data) => {
  const response = await api.patch(`/support-queries/admin/${id}`, data);
  return response.data;
};

/**
 * Delete support query
 * @param {string} id - Query ID
 * @returns {Promise} API response
 */
export const deleteQuery = async (id) => {
  const response = await api.delete(`/support-queries/admin/${id}`);
  return response.data;
};

/**
 * Get support query statistics
 * @returns {Promise} API response with statistics
 */
export const getStats = async () => {
  const response = await api.get('/support-queries/admin/stats');
  return response.data;
};

export const supportQueriesAPI = {
  getAllQueries,
  getQueryById,
  updateQuery,
  deleteQuery,
  getStats,
};
