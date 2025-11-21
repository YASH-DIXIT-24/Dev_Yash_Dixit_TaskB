function isValidUrlCheck(string) {
  // Basic checks first
  if (!string || typeof string !== 'string') {
    return false;
  }

  // Remove leading/trailing whitespace
  string = string.trim();

  try {
    const url = new URL(string);
    
    // Only allow http and https protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    // Make sure there's actually a hostname
    if (!url.hostname || url.hostname.length === 0) {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
}

module.exports = { isValidUrlCheck };