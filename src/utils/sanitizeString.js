export const sanitizeString = (input) =>
  input
    .replace(/[\/\\:*?"<>|]/g, '')
    .replace(/[''''""`]/g, '')   // remove all quote variants
    .replace(/\s+/g, ' ')
    .replace(/\.+$/g, '')
    .trim();
