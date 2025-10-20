import { showToast, TOAST_MESSAGES } from './toastConfig';

const BREVO_API_KEY = process.env.REACT_APP_BREVO_API_KEY || "";
console.log('API Key loaded:', BREVO_API_KEY ? 'Found' : 'Not found');
const BREVO_LIST_ID = 5; // Accompliq Subscribers list ID

/**
 * Add contact to Brevo newsletter - Accompliq Subscribers list
 * @param {string} email 
 * @param {string} name 
 * @returns {Promise<Object>}
 */
export async function addContactToBrevo(email, name = '') {
  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: name
        },
        listIds: [BREVO_LIST_ID] // Accompliq Subscribers list
      })
    });

    const data = await response.json();

    if (response.ok) {
      showToast.success(TOAST_MESSAGES.NEWSLETTER_SUBSCRIBE_SUCCESS);
      return { success: true };
    } else if (response.status === 400 && data.code === 'duplicate_parameter') {
      showToast.success(TOAST_MESSAGES.NEWSLETTER_ALREADY_SUBSCRIBED);
      return { success: true };
    } else {
      console.error('Brevo API Error:', data);
      showToast.error(TOAST_MESSAGES.NEWSLETTER_SUBSCRIBE_ERROR);
      return { success: false };
    }
  } catch (error) {
    console.error('Brevo API Network Error:', error);
    showToast.error(TOAST_MESSAGES.NEWSLETTER_NETWORK_ERROR);
    return { success: false };
  }
}

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate name (at least 2 characters, no numbers)
 * @param {string} name 
 * @returns {boolean}
 */
export function validateName(name) {
  if (!name || name.trim().length < 2) return false;
  
  // Check for reasonable name patterns (allow letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name.trim());
}

/**
 * Validate form data for Accompliq subscription
 * @param {Object} formData 
 * @returns {Object}
 */
export function validateForm(formData) {
  const errors = {};

  if (!formData.name || !validateName(formData.name)) {
    errors.name = 'Please enter a valid name (letters only, at least 2 characters)';
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
