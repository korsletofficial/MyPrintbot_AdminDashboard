import api from '../axios';

/**
 * Get all FAQs for admin (including inactive)
 * @returns {Promise} API response with FAQs
 */
export const getAllFAQs = async () => {
  const response = await api.get('/faqs/admin');
  return response.data;
};

/**
 * Get single FAQ by ID
 * @param {string} id - FAQ ID
 * @returns {Promise} API response with FAQ
 */
export const getFAQById = async (id) => {
  const response = await api.get(`/faqs/admin/${id}`);
  return response.data;
};

/**
 * Create new FAQ
 * @param {Object} data - FAQ data
 * @returns {Promise} API response
 */
export const createFAQ = async (data) => {
  const response = await api.post('/faqs/admin', data);
  return response.data;
};

/**
 * Update FAQ
 * @param {string} id - FAQ ID
 * @param {Object} data - FAQ data to update
 * @returns {Promise} API response
 */
export const updateFAQ = async (id, data) => {
  const response = await api.patch(`/faqs/admin/${id}`, data);
  return response.data;
};

/**
 * Delete FAQ
 * @param {string} id - FAQ ID
 * @returns {Promise} API response
 */
export const deleteFAQ = async (id) => {
  const response = await api.delete(`/faqs/admin/${id}`);
  return response.data;
};

/**
 * Reorder FAQs
 * @param {Array} faqs - Array of {id, order}
 * @returns {Promise} API response
 */
export const reorderFAQs = async (faqs) => {
  const response = await api.put('/faqs/admin/reorder', { faqs });
  return response.data;
};

export const faqsAPI = {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  reorderFAQs,
};
