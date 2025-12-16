import api from '../axios';

/**
 * Template API Service
 * Handles all template-related API calls
 */

/**
 * Upload template files (blank and preview)
 * @param {Object} files - Object containing File objects
 * @param {File} files.front.blank - Front blank template
 * @param {File} files.front.preview - Front preview template
 * @param {File} [files.back.blank] - Back blank template (optional)
 * @param {File} [files.back.preview] - Back preview template (optional)
 * @returns {Promise} Upload response with URLs
 */
export const uploadTemplateFiles = async (files) => {
  const formData = new FormData();

  // Add front side files (required)
  if (files.front.blank) {
    formData.append('frontBlank', files.front.blank);
  }
  if (files.front.preview) {
    formData.append('frontPreview', files.front.preview);
  }

  // Add back side files (optional)
  if (files.back?.blank) {
    formData.append('backBlank', files.back.blank);
  }
  if (files.back?.preview) {
    formData.append('backPreview', files.back.preview);
  }

  const response = await api.post('/templates/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Create template with metadata and uploaded file URLs
 * @param {Object} templateData - Complete template data
 * @returns {Promise} Created template
 */
export const createTemplate = async (templateData) => {
  const response = await api.post('/templates/create', templateData);
  return response.data;
};

/**
 * Get all templates (unified endpoint for all roles)
 * @param {Object} filters - Filter options
 * @param {string} filters.source - Template source: 'all', 'my-templates', 'myprintbot' (default: 'all')
 * @param {string} filters.category - Filter by category
 * @param {string} filters.orientation - Filter by orientation (LANDSCAPE, PORTRAIT)
 * @param {string} filters.search - Search by name
 * @param {number} filters.limit - Number of results
 * @param {number} filters.offset - Pagination offset
 * @returns {Promise} List of templates
 *
 * Behavior by role:
 * - Admin: Always sees admin templates (MyPrintBot)
 * - Print Partner:
 *     - source=my-templates: Own templates
 *     - source=myprintbot: Admin templates
 *     - source=all: Both
 * - Client: Admin templates + templates from associated print partners
 * - Public/No auth: Admin templates only
 */
export const getAllTemplates = async (filters = {}) => {
  const response = await api.get('/templates', { params: filters });
  return response.data;
};

/**
 * Get user's custom templates
 * @returns {Promise} User's templates
 */
export const getMyTemplates = async () => {
  const response = await api.get('/templates/my-templates');
  return response.data;
};

/**
 * Get template by ID
 * @param {String} templateId - Template ID
 * @returns {Promise} Template details
 */
export const getTemplateById = async (templateId) => {
  const response = await api.get(`/templates/${templateId}`);
  return response.data;
};

/**
 * Delete template
 * @param {String} templateId - Template ID
 * @returns {Promise} Delete response
 */
export const deleteTemplate = async (templateId) => {
  const response = await api.delete(`/templates/${templateId}`);
  return response.data;
};

/**
 * Clone template to create a job
 * @param {String} templateId - Template ID
 * @param {Object} jobData - Job creation data
 * @returns {Promise} Created job
 */
export const cloneTemplateToJob = async (templateId, jobData) => {
  const response = await api.post(`/templates/${templateId}/clone`, jobData);
  return response.data;
};

export const templatesAPI = {
  uploadTemplateFiles,
  createTemplate,
  getAllTemplates,
  getMyTemplates,
  getTemplateById,
  deleteTemplate,
  cloneTemplateToJob,
};

export default templatesAPI;
