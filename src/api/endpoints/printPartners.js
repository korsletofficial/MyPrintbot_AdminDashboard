import api from '../axios';

/**
 * Get all print partners with statistics
 * @param {Object} params - Query parameters (page, limit, search, status)
 * @returns {Promise} API response with print partners list
 */
export const getPrintPartners = async (params = {}) => {
  const response = await api.get('/admin/print-partners', { params });
  return response.data;
};

/**
 * Get print partner details
 * @param {string} id - Print partner ID
 * @returns {Promise} API response with partner details
 */
export const getPrintPartnerDetails = async (id) => {
  const response = await api.get(`/admin/print-partners/${id}`);
  return response.data;
};

/**
 * Update print partner
 * @param {string} id - Print partner ID
 * @param {Object} data - Update data (orgName, phone, status)
 * @returns {Promise} API response
 */
export const updatePrintPartner = async (id, data) => {
  const response = await api.patch(`/admin/print-partners/${id}`, data);
  return response.data;
};

/**
 * Block print partner
 * @param {string} id - Print partner ID
 * @param {string} reason - Reason for blocking
 * @returns {Promise} API response
 */
export const blockPrintPartner = async (id, reason) => {
  const response = await api.post(`/users/${id}/block`, { reason });
  return response.data;
};

/**
 * Unblock print partner
 * @param {string} id - Print partner ID
 * @returns {Promise} API response
 */
export const unblockPrintPartner = async (id) => {
  const response = await api.post(`/users/${id}/unblock`);
  return response.data;
};

/**
 * Delete print partner
 * @param {string} id - Print partner ID
 * @returns {Promise} API response
 */
export const deletePrintPartner = async (id) => {
  const response = await api.delete(`/admin/print-partners/${id}`);
  return response.data;
};

export const printPartnersAPI = {
  getPrintPartners,
  getPrintPartnerDetails,
  updatePrintPartner,
  blockPrintPartner,
  unblockPrintPartner,
  deletePrintPartner,
};
