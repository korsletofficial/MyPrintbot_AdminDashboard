/**
 * Image utility functions
 */

import { API_BASE_URL } from '../config';

/**
 * Get the full URL for an image
 * Handles both base64 data URLs and server paths
 * @param {string} imageUrl - The image URL (can be base64 or server path)
 * @returns {string} Full image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';

  // If it's already a full URL (data:image or http/https), return as is
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative path, prepend the backend URL
  const backendUrl = API_BASE_URL.replace('/api', '');

  // Ensure path starts with /
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

  return `${backendUrl}${path}`;
};

/**
 * Check if an image URL is a base64 data URL
 * @param {string} imageUrl - The image URL
 * @returns {boolean} True if it's a base64 data URL
 */
export const isBase64Image = (imageUrl) => {
  return imageUrl?.startsWith('data:image');
};

/**
 * Check if an image URL is a server path
 * @param {string} imageUrl - The image URL
 * @returns {boolean} True if it's a server path
 */
export const isServerPath = (imageUrl) => {
  return imageUrl?.startsWith('/uploads') || imageUrl?.startsWith('uploads');
};
