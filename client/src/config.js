// Configuration for API endpoints based on environment
const config = {
  development: {
    apiUrl: 'http://localhost:5000/api',
  },
  production: {
    // You'll need to update this with your actual backend URL once deployed
    apiUrl: 'https://bizbuddy-finance-backend.onrender.com/api',
  }
};

const env = process.env.NODE_ENV || 'development';

// Create a configuration object before exporting to avoid ESLint warning
const appConfig = {
  apiUrl: config[env].apiUrl,
};

export default appConfig;