import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RevenueTracking from '../Forms/RevenueTracking';
import GrowthAnalysis from '../Forms/GrowthAnalysis';
import ProfitROI from '../Forms/ProfitROI';
import Slideshow from '../Slideshow/Slideshow';
import './Dashboard.css';

const Dashboard = () => {
  const [activeForm, setActiveForm] = useState('revenue');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    // Set auth header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  // Handle form submission and update data
  const handleFormSubmit = async (formData, formType) => {
    setLoading(true);
    try {
      // Post the form data to appropriate API endpoint
      const response = await axios.post(`/api/${formType}`, formData);
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error(`Error submitting ${formType} data:`, err);
      setError(`Failed to submit ${formType} data. Please try again.`);
      setLoading(false);
      return null;
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Get username with fallback to ensure something displays
  const username = user?.username || user?.name || user?.email || 'Guest';

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">BizBuddy</div>
        <h1>Financial Statistics Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {username}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      {/* Slideshow with form navigation */}
      <div className="slideshow-container">
        <Slideshow onFormChange={setActiveForm} />
      </div>

      <div className="data-entry-section">
        <div className="form-navigation">
          <button 
            className={activeForm === 'revenue' ? 'active' : ''} 
            onClick={() => setActiveForm('revenue')}
          >
            Revenue Tracking
          </button>
          <button 
            className={activeForm === 'growth' ? 'active' : ''} 
            onClick={() => setActiveForm('growth')}
          >
            Growth Analysis
          </button>
          <button 
            className={activeForm === 'profit' ? 'active' : ''} 
            onClick={() => setActiveForm('profit')}
          >
            Profit & ROI
          </button>
        </div>
        
        {loading && <div className="loading-indicator">Processing your request...</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-content">
          {activeForm === 'revenue' && (
            <RevenueTracking onSubmit={(data) => handleFormSubmit(data, 'revenue-tracking')} />
          )}
          
          {activeForm === 'growth' && (
            <GrowthAnalysis onSubmit={(data) => handleFormSubmit(data, 'growth-analysis')} />
          )}
          
          {activeForm === 'profit' && (
            <ProfitROI onSubmit={(data) => handleFormSubmit(data, 'profit-roi')} />
          )}
        </div>
      </div>
      
      {/* Footer with contact information */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Need Help?</h4>
            <p>Our financial experts are just a call away to assist you with any questions or suggestions.</p>
          </div>
          
          <div className="footer-section">
            <h4>Talk to Experts</h4>
            <div className="contact-options">
              <a href="tel:+918000123456" className="contact-link">
                <i className="fa fa-phone"></i> +91 8000 123 456
              </a>
              <a href="mailto:experts@bizbuddy.com" className="contact-link">
                <i className="fa fa-envelope"></i> experts@bizbuddy.com
              </a>
              <button className="btn-contact">Schedule a Consultation</button>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Financial Insights</h4>
            <p>Subscribe to our newsletter for the latest tips and trends in financial management.</p>
            <div className="subscription-box">
              <input type="email" placeholder="Enter your email" />
              <button className="btn-subscribe">Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2023 BizBuddy Financial Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
