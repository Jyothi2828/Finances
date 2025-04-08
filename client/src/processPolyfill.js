// Simple polyfill for the Node.js process object in the browser
if (typeof window !== 'undefined') {
  window.process = {
    env: {
      NODE_ENV: 'development'
    }
  };
}

// Ensure http-proxy-middleware is properly available
try {
  const { createProxyMiddleware } = require('http-proxy-middleware');
  if (typeof createProxyMiddleware !== 'function') {
    console.warn('createProxyMiddleware is not properly imported as a function');
  }
} catch (e) {
  console.error('Error importing http-proxy-middleware:', e.message);
}

export default {};