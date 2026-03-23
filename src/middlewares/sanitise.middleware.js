import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// Export as an array of middleware functions
export const sanitizeInput = [mongoSanitize(), xss()];