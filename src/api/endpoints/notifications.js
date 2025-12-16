import api from '../axios';

/**
 * Fetch notifications for authenticated user
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Number of notifications to fetch
 * @param {number} params.offset - Offset for pagination
 * @param {boolean} params.unreadOnly - Fetch only unread notifications
 * @returns {Promise} Axios promise
 */
export const getNotifications = async (params = {}) => {
  const { limit = 50, offset = 0, unreadOnly = false } = params;
  return api.get('/notifications', {
    params: { limit, offset, unreadOnly },
  });
};

/**
 * Get unread notification count
 * @returns {Promise} Axios promise
 */
export const getUnreadCount = async () => {
  return api.get('/notifications/unread-count');
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise} Axios promise
 */
export const markAsRead = async (notificationId) => {
  return api.patch(`/notifications/${notificationId}/read`);
};

/**
 * Mark all notifications as read
 * @returns {Promise} Axios promise
 */
export const markAllAsRead = async () => {
  return api.patch('/notifications/read-all');
};

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise} Axios promise
 */
export const deleteNotification = async (notificationId) => {
  return api.delete(`/notifications/${notificationId}`);
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
