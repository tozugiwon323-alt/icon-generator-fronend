/**
 * Frontend validation utilities
 */

/**
 * Validate HEX color format
 * @param {string} color - Color string to validate
 * @returns {boolean} True if valid HEX color
 */
export function validateHexColor(color) {
  if (!color) return false;
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Validate prompt input
 * @param {string} prompt - Prompt to validate
 * @returns {{valid: boolean, error: string|null}} Validation result
 */
export function validatePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt is required' };
  }
  
  const trimmed = prompt.trim();
  
  if (trimmed === '') {
    return { valid: false, error: 'Prompt cannot be empty' };
  }
  
  if (trimmed.length < 3) {
    return { valid: false, error: 'Prompt must be at least 3 characters' };
  }
  
  if (trimmed.length > 200) {
    return { valid: false, error: 'Prompt must be less than 200 characters' };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate colors array
 * @param {string[]} colors - Array of color strings
 * @returns {{valid: boolean, error: string|null}} Validation result
 */
export function validateColors(colors) {
  if (!Array.isArray(colors)) {
    return { valid: false, error: 'Colors must be an array' };
  }
  
  const nonEmptyColors = colors.filter(c => c && c.trim() !== '');
  
  if (nonEmptyColors.length === 0) {
    return { valid: true, error: null }; // Empty is okay
  }
  
  const invalidColors = nonEmptyColors.filter(c => !validateHexColor(c));
  
  if (invalidColors.length > 0) {
    return { 
      valid: false, 
      error: `Invalid HEX colors: ${invalidColors.join(', ')}. Use format #RRGGBB` 
    };
  }
  
  return { valid: true, error: null };
}

/**
 * Sanitize prompt input
 * @param {string} prompt - Prompt to sanitize
 * @returns {string} Sanitized prompt
 */
export function sanitizePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') return '';
  
  return prompt
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .slice(0, 200); // Max length
}

