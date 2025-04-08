import React, { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import './Forms.css';

const ProfitROI = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    revenue: '',
    expenses: '',
    investment: '',
    year: new Date().getFullYear(),
    quarter: '1'
  });
  
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('pie');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Calculate in real-time if all required values are present
    if (newFormData.revenue && newFormData.expenses) {
      const revenue = parseFloat(newFormData.revenue);
      const expenses = parseFloat(newFormData.expenses);
      const investment = parseFloat(newFormData.investment) || 0;
      
      if (!isNaN(revenue) && !isNaN(expenses)) {
        calculateProfitAndROI(revenue, expenses, investment);
      }
    }
  };
  
  const toggleChartType = () => {
    setChartType(chartType === 'pie' ? 'bar' : 'pie');
  };
  
  const calculateProfitAndROI = (revenue, expenses, investment) => {
    // Calculate profit
    const profit = revenue - expenses;
    
    // Calculate profit margin
    const profitMargin = (profit / revenue) * 100;
    
    // Calculate ROI only if investment is provided
    let roi = null;
    if (investment > 0) {
      roi = (profit / investment) * 100;
    }
    
    setResult({
      profit: profit.toFixed(2),
      profitMargin: profitMargin.toFixed(2),
      roi: roi !== null ? roi.toFixed(2) : null,
      revenue,
      expenses,
      investment
    });
    
    // Update chart data
    updateChartData(revenue, expenses, profit, investment);
  };
  
  const updateChartData = (revenue, expenses, profit, investment) => {
    // Pie chart data for revenue breakdown
    const pieData = {
      labels: ['Profit', 'Expenses'],
      datasets: [
        {
          data: [profit, expenses],
          backgroundColor: [
            profit > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderColor: [
            profit > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
    
    // Bar chart data for metrics comparison
    const barData = {
      labels: ['Revenue', 'Expenses', 'Profit'],
      datasets: [
        {
          label: 'Financial Metrics',
          data: [revenue, expenses, profit],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            profit > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            profit > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
    
    setChartData({ pieData, barData });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.revenue || !formData.expenses) {
      alert('Please fill in all required fields');
      return;
    }
    
    const revenue = parseFloat(formData.revenue);
    const expenses = parseFloat(formData.expenses);
    const investment = parseFloat(formData.investment) || 0;
    
    // Calculate profit
    const profit = revenue - expenses;
    
    // Calculate profit margin
    const profitMargin = (profit / revenue) * 100;
    
    // Calculate ROI
    let roi = null;
    if (investment > 0) {
      roi = (profit / investment) * 100;
    }
    
    const dataToSubmit = {
      ...formData,
      revenue,
      expenses,
      investment,
      profit,
      profitMargin,
      roi: roi !== null ? roi : null,
      date: new Date(formData.year, (parseInt(formData.quarter) - 1) * 3)
    };
    
    const response = await onSubmit(dataToSubmit);
    
    if (response) {
      // Clear form and show success message
      setFormData({
        companyName: '',
        revenue: '',
        expenses: '',
        investment: '',
        year: new Date().getFullYear(),
        quarter: '1'
      });
      
      setResult(null);
      setChartData(null);
      
      alert('Profit & ROI data saved successfully!');
    }
  };
  
  return (
    <div className="form-container">
      <div className="form-section">
        <h3>Profit & ROI Calculator</h3>
        <p className="form-description">
          Find out how much the company actually earns and how effectively it invests.
          <br />
          <strong>Profit = Revenue - Expenses</strong>
          <br />
          <strong>Profit Margin = (Profit / Revenue) × 100</strong>
          <br />
          <strong>ROI = (Profit / Investment) × 100</strong>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="revenue">Revenue (₹)</label>
            <input
              type="number"
              id="revenue"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="expenses">Expenses (₹)</label>
            <input
              type="number"
              id="expenses"
              name="expenses"
              value={formData.expenses}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          {/* <div className="form-group">
            <label htmlFor="investment">Investment (₹) (Optional for ROI)</label>
            <input
              type="number"
              id="investment"
              name="investment"
              value={formData.investment}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div> */}
          
          {/* <div className="form-row">
            <div className="form-group">
              <label htmlFor="quarter">Quarter</label>
              <select
                id="quarter"
                name="quarter"
                value={formData.quarter}
                onChange={handleChange}
                required
              >
                <option value="1">Q1</option>
                <option value="2">Q2</option>
                <option value="3">Q3</option>
                <option value="4">Q4</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max="2100"
                required
              />
            </div>
          </div> */}
          
          {/* <div className="form-actions">
            <button type="submit" className="btn-submit">Submit</button>
          </div> */}
        </form>
      </div>
      
      <div className="chart-section">
        <div className="chart-header">
          <h3>Financial Metrics Visualization</h3>
          
          {chartData && (
            <button onClick={toggleChartType} className="btn-toggle-chart">
              Switch to {chartType === 'pie' ? 'Bar' : 'Pie'} Chart
            </button>
          )}
        </div>
        {result && (
              <div className="result-summary">
                <h4>Calculated Results:</h4>
                <p>
                  <strong>Profit:</strong> 
                  <span className={parseFloat(result.profit) >= 0 ? 'positive' : 'negative'}>
                    ₹{parseFloat(result.profit).toLocaleString()}
                  </span>
                </p>
                <p>
                  <strong>Profit Margin:</strong> 
                  <span className={parseFloat(result.profitMargin) >= 0 ? 'positive' : 'negative'}>
                    {result.profitMargin}%
                  </span>
                </p>
                {result.roi !== null && (
                  <p>
                    <strong>ROI:</strong> 
                    <span className={parseFloat(result.roi) >= 0 ? 'positive' : 'negative'}>
                      {result.roi}%
                    </span>
                  </p>
                )}
                <p>
                  <strong>Revenue Breakdown:</strong> ₹{result.revenue.toLocaleString()} revenue - 
                  ₹{result.expenses.toLocaleString()} expenses = 
                  <span className={parseFloat(result.profit) >= 0 ? 'positive' : 'negative'}>
                    ₹{parseFloat(result.profit).toLocaleString()} profit
                  </span>
                </p>
              </div>
            )}
        
        {chartData ? (
          <div className="chart-container">
            {chartType === 'pie' ? (
              <Pie
                data={chartData.pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <Bar
                data={chartData.barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Amount (₹)'
                      }
                    }
                  }
                }}
              />
            )}
            
           
          </div>
        ) : (
          <div className="chart-placeholder">
            <p>Enter financial data to see profit and ROI calculations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitROI;