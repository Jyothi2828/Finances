// Configuration for API endpoints based on environment
const config = {
  development: {
    apiUrl: 'http://localhost:5000/api',
  },
  production: {
    // Updated with your actual deployed backend URL
    apiUrl: 'https://finances-bb04.onrender.com',
  }
};

const env = process.env.NODE_ENV || 'development';

// Create a configuration object before exporting to avoid ESLint warning
const appConfig = {
  apiUrl: config[env].apiUrl,
};

export default appConfig;