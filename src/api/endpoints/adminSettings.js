import api from '../axios';

/**
 * Get admin settings
 * @returns {Promise} API response with admin settings
 */
export const getAdminSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

/**
 * Update admin settings
 * @param {Object} data - Settings data to update
 * @returns {Promise} API response
 */
export const updateAdminSettings = async (data) => {
  const response = await api.patch('/admin/settings', data);
  return response.data;
};

export const adminSettingsAPI = {
  getAdminSettings,
  updateAdminSettings,
};
