/**
 * Helper to sanitize and limit GPA / CGPA user input.
 * Ensures input cannot exceed maxScale (e.g., 5.00 or 4.00).
 */
export const sanitizeGpaInput = (rawValue: string, maxScale: number = 5.00): string => {
  if (!rawValue) return '';

  // Filter out any character that is not a digit or decimal point
  let cleaned = rawValue.replace(/[^0-9.]/g, '');

  // Keep only the first decimal point if user typed multiple
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }

  // Limit decimal places to maximum 2 digits (e.g. 5.00, 3.75)
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + '.' + parts[1].slice(0, 2);
  }

  // If number exceeds maxScale (e.g. 5.00 or 4.00), clamp to maxScale
  const num = parseFloat(cleaned);
  if (!isNaN(num) && num > maxScale) {
    return maxScale.toFixed(2);
  }

  return cleaned;
};
