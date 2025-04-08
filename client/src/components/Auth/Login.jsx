import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  // Refs for input elements
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { email, password } = formData;

  // Focus email input when component mounts
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      
      // Store the token in localStorage
      localStorage.setItem('token', res.data.token);
      
      // Redirect to dashboard
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  // Explicitly force focus on inputs when clicked
  const focusInput = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form className="auth-form" onSubmit={onSubmit} onClick={(e) => e.stopPropagation()}>
          {error && <div className="auth-error">{error}</div>}
          
          <div className="form-group" onClick={() => focusInput(emailInputRef)}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              ref={emailInputRef}
              value={email}
              onChange={onChange}
              required
              placeholder="Enter your email"
              autoComplete="email"
              tabIndex="1"
            />
          </div>
          
          <div className="form-group" onClick={() => focusInput(passwordInputRef)}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              ref={passwordInputRef}
              value={password}
              onChange={onChange}
              required
              placeholder="Enter your password"
              minLength="6"
              autoComplete="current-password"
              tabIndex="2"
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading} tabIndex="3">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Don't have an account? <a href="/register" tabIndex="4">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;