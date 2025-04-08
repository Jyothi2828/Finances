import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './Forms.css';

const RevenueTracking = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    totalRevenue: '',
    numberOfCustomers: '',
    period: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Calculate real-time average revenue per customer
    if (newFormData.totalRevenue && newFormData.numberOfCustomers) {
      const totalRevenue = parseFloat(newFormData.totalRevenue);
      const numberOfCustomers = parseInt(newFormData.numberOfCustomers);
      
      if (totalRevenue && numberOfCustomers) {
        const avgRevenue = totalRevenue / numberOfCustomers;
        updateChartData(totalRevenue, numberOfCustomers, avgRevenue);
      }
    }
  };
  
  const updateChartData = (totalRevenue, numberOfCustomers, avgRevenue) => {
    setChartData({
      labels: ['Total Revenue', 'Avg. Revenue per Customer'],
      datasets: [
        {
          label: 'Revenue Metrics',
          data: [totalRevenue, avgRevenue.toFixed(2)],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    });
    
    setResult({
      avgRevenuePerCustomer: avgRevenue.toFixed(2),
      totalRevenue: totalRevenue,
      numberOfCustomers: numberOfCustomers
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.totalRevenue || !formData.numberOfCustomers) {
      alert('Please fill in all required fields');
      return;
    }
    
    const totalRevenue = parseFloat(formData.totalRevenue);
    const numberOfCustomers = parseInt(formData.numberOfCustomers);
    const avgRevenue = totalRevenue / numberOfCustomers;
    
    const dataToSubmit = {
      ...formData,
      totalRevenue: totalRevenue,
      numberOfCustomers: numberOfCustomers,
      avgRevenuePerCustomer: avgRevenue,
      date: new Date(formData.year, formData.month - 1)
    };
    
    const response = await onSubmit(dataToSubmit);
    
    if (response) {
      // Clear form and show success message
      setFormData({
        companyName: '',
        totalRevenue: '',
        numberOfCustomers: '',
        period: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      });
      
      alert('Revenue data saved successfully!');
    }
  };
  
  return (
    <div className="form-container">
      <div className="form-section">
        <h3>Revenue Tracking</h3>
        <p className="form-description">
          Calculate how much revenue each customer brings using the formula:
          <br />
        </p>
        
        <form onSubmit={handleSubmit}>
          
          
          <div className="form-group">
            <label htmlFor="totalRevenue">Total Revenue (₹)</label>
            <input
              type="number"
              id="totalRevenue"
              name="totalRevenue"
              value={formData.totalRevenue}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="numberOfCustomers">Number of Customers</label>
            <input
              type="number"
              id="numberOfCustomers"
              name="numberOfCustomers"
              value={formData.numberOfCustomers}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          
          
          {/* <div className="form-actions">
            <button type="submit" className="btn-submit">Submit</button>
          </div> */}
        </form>
      </div>
      
      <div className="chart-section">
      <h3>Revenue Metrics Visualization</h3>

      {result && (
              <div className="result-summary">
                <h4>Calculated Result:</h4>
                <p>
                  <strong>Average Revenue per Customer:</strong> ₹{result.avgRevenuePerCustomer}
                </p>
                <p>
                  <strong>Total Revenue:</strong> ₹{result.totalRevenue.toLocaleString()}
                </p>
                <p>
                  <strong>Total Customers:</strong> {result.numberOfCustomers.toLocaleString()}
                </p>
              </div>
            )}
        {chartData ? (
          <div className="chart-container">
            <Bar
              data={chartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
                responsive: true,
                maintainAspectRatio: false
              }}
            />
            
         
          </div>
        ) : (
          <div className="chart-placeholder">
            <p>Enter revenue data to see real-time visualization</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueTracking;