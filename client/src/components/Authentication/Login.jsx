import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo(null);

    try {
      // Normalize email to lowercase before sending
      const normalizedFormData = {
        ...formData,
        email: formData.email.toLowerCase().trim()
      };
      
      console.log('Attempting to log in with:', normalizedFormData.email);
      
      const response = await api.post('/api/auth/login', normalizedFormData);
      
      console.log('Login API Response:', response);
      
      // Store debug information
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        data: JSON.stringify(response.data)
      });
      
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response format: Missing token');
      }
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Safely handle the case where user object might be missing fields
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Only check role if it exists
        if (response.data.user.role && response.data.user.role !== 'business') {
          setError('Access denied. Only business accounts can access financial statistics.');
          setLoading(false);
          return;
        }
        
        console.log('Login successful for user:', response.data.user.email);
      } else {
        // If user data is missing, just store what we have
        console.log('Login successful but user data incomplete');
        localStorage.setItem('user', JSON.stringify({ email: formData.email }));
      }
      
      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error details:', err);
      
      // Store debug information about the error
      setDebugInfo({
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: JSON.stringify(err.response.data)
        } : 'No response object',
        request: err.request ? 'Request sent but no response received' : 'Request not sent'
      });
      
      // Handle different error scenarios
      if (err.message.includes("Cannot read properties of undefined")) {
        setError('Invalid server response. The server returned unexpected data structure.');
      } else if (!err.response && err.message === 'Network Error') {
        setError('Cannot connect to server. Please check if the server is running.');
      } else if (err.response?.status === 401) {
        setError('Invalid credentials. Please check your email and password.');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Contact administrator.');
      } else {
        setError(
          err.response?.data?.message || 
          'Login failed. Please check your credentials and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card login-card">
        <div className="auth-header">
          <h2>Financial Statistics Portal</h2>
          <h3>Business User Login</h3>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <div className="debug-info">
              <details>
                <summary>Debug Information (Dev Only)</summary>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </details>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;