import api from '../axios';

/**
 * Get all clients with statistics
 * @param {Object} params - Query parameters (page, limit, search, status)
 * @returns {Promise} API response with clients list
 */
export const getClients = async (params = {}) => {
  const response = await api.get('/admin/clients', { params });
  return response.data;
};

/**
 * Get client details
 * @param {string} id - Client ID
 * @returns {Promise} API response with client details
 */
export const getClientDetails = async (id) => {
  const response = await api.get(`/admin/clients/${id}`);
  return response.data;
};

/**
 * Update client
 * @param {string} id - Client ID
 * @param {Object} data - Update data (name, orgName, phone, status)
 * @returns {Promise} API response
 */
export const updateClient = async (id, data) => {
  const response = await api.patch(`/admin/clients/${id}`, data);
  return response.data;
};

/**
 * Block client
 * @param {string} id - Client ID
 * @param {string} reason - Reason for blocking
 * @returns {Promise} API response
 */
export const blockClient = async (id, reason) => {
  const response = await api.post(`/users/${id}/block`, { reason });
  return response.data;
};

/**
 * Unblock client
 * @param {string} id - Client ID
 * @returns {Promise} API response
 */
export const unblockClient = async (id) => {
  const response = await api.post(`/users/${id}/unblock`);
  return response.data;
};

/**
 * Delete client
 * @param {string} id - Client ID
 * @returns {Promise} API response
 */
export const deleteClient = async (id) => {
  const response = await api.delete(`/admin/clients/${id}`);
  return response.data;
};

export const clientsAPI = {
  getClients,
  getClientDetails,
  updateClient,
  blockClient,
  unblockClient,
  deleteClient,
};
