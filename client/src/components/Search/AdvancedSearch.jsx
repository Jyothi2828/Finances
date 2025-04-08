import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';

const AdvancedSearch = ({ onSearchResults }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    minRevenue: '',
    minCagr: '',
    minProfitMargin: '',
    minRoi: '',
    minRetentionRate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Build query parameters
      const params = {};
      
      if (formData.companyName.trim()) {
        params.companyName = formData.companyName;
      }
      
      if (formData.minRevenue) {
        params.revenue = formData.minRevenue;
      }
      
      if (formData.minCagr) {
        params.cagr = formData.minCagr;
      }
      
      if (formData.minProfitMargin) {
        params.profitMargin = formData.minProfitMargin;
      }
      
      if (formData.minRoi) {
        params.roi = formData.minRoi;
      }
      
      if (formData.minRetentionRate) {
        params.customerRetentionRate = formData.minRetentionRate;
      }

      const response = await axios.get('/api/financial-data/search/advanced', { params });
      
      if (onSearchResults) {
        onSearchResults(response.data);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error performing search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      companyName: '',
      minRevenue: '',
      minCagr: '',
      minProfitMargin: '',
      minRoi: '',
      minRetentionRate: ''
    });
    
    // Reset to show all data
    axios.get('/api/financial-data')
      .then(response => {
        if (onSearchResults) {
          onSearchResults(response.data);
        }
      })
      .catch(err => {
        console.error('Error resetting search:', err);
      });
  };

  return (
    <div className="advanced-search">
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="search-grid">
          {/* <div className="search-field">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Company name..."
            />
          </div> */}
          
          <div className="search-field">
            <label htmlFor="minRevenue">Minimum Revenue</label>
            <input
              type="number"
              id="minRevenue"
              name="minRevenue"
              value={formData.minRevenue}
              onChange={handleInputChange}
              placeholder="Min revenue..."
              min="0"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="minCagr">Minimum CAGR (%)</label>
            <input
              type="number"
              id="minCagr"
              name="minCagr"
              value={formData.minCagr}
              onChange={handleInputChange}
              placeholder="Min growth rate..."
              step="0.01"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="minProfitMargin">Minimum Profit Margin (%)</label>
            <input
              type="number"
              id="minProfitMargin"
              name="minProfitMargin"
              value={formData.minProfitMargin}
              onChange={handleInputChange}
              placeholder="Min profit margin..."
              step="0.01"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="minRoi">Minimum ROI (%)</label>
            <input
              type="number"
              id="minRoi"
              name="minRoi"
              value={formData.minRoi}
              onChange={handleInputChange}
              placeholder="Min ROI..."
              step="0.01"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="minRetentionRate">Minimum Customer Retention (%)</label>
            <input
              type="number"
              id="minRetentionRate"
              name="minRetentionRate"
              value={formData.minRetentionRate}
              onChange={handleInputChange}
              placeholder="Min retention rate..."
              step="0.01"
              min="0"
              max="100"
            />
          </div>
        </div>
        
        <div className="search-buttons">
          <button 
            type="submit" 
            className="btn-search"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button 
            type="button" 
            className="btn-reset"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;