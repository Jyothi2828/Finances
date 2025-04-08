import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import './Forms.css';

const GrowthAnalysis = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    startingRevenue: '',
    endingRevenue: '',
    timeYears: '',
    startYear: '',
    endYear: ''
  });
  
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Auto-calculate timeYears if start and end years are provided
    if (name === 'startYear' || name === 'endYear') {
      if (newFormData.startYear && newFormData.endYear) {
        const start = parseInt(newFormData.startYear);
        const end = parseInt(newFormData.endYear);
        if (end >= start) {
          const years = end - start;
          newFormData.timeYears = years;
          setFormData(newFormData);
        }
      }
    }
    
    // Calculate CAGR in real-time if all required values are present
    if (newFormData.startingRevenue && newFormData.endingRevenue && newFormData.timeYears) {
      calculateCAGR(
        parseFloat(newFormData.startingRevenue),
        parseFloat(newFormData.endingRevenue),
        parseFloat(newFormData.timeYears)
      );
    }
  };
  
  const calculateCAGR = (startingRevenue, endingRevenue, timeYears) => {
    if (startingRevenue <= 0 || endingRevenue <= 0 || timeYears <= 0) return;
    
    // CAGR formula: ((EndValue / StartValue) ^ (1 / Years)) - 1
    const cagr = (Math.pow(endingRevenue / startingRevenue, 1 / timeYears) - 1) * 100;
    
    setResult({
      cagr: cagr.toFixed(2),
      startingRevenue,
      endingRevenue,
      timeYears
    });
    
    // Create projection data
    const projectionData = [];
    for (let i = 0; i <= timeYears; i++) {
      const projectedRevenue = startingRevenue * Math.pow(1 + cagr / 100, i);
      projectionData.push({
        year: parseInt(formData.startYear || new Date().getFullYear()) + i,
        revenue: projectedRevenue
      });
    }
    
    setChartData({
      labels: projectionData.map(item => item.year),
      datasets: [
        {
          label: 'Revenue Growth',
          data: projectionData.map(item => item.revenue),
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        },
        {
          label: 'Linear Growth Reference',
          data: projectionData.map((item, index) => {
            if (index === 0) return startingRevenue;
            if (index === timeYears) return endingRevenue;
            // Calculate point on the straight line
            const increment = (endingRevenue - startingRevenue) / timeYears;
            return startingRevenue + (increment * index);
          }),
          fill: false,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0
        }
      ]
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startingRevenue || !formData.endingRevenue || !formData.timeYears) {
      alert('Please fill in all required fields');
      return;
    }
    
    const startingRevenue = parseFloat(formData.startingRevenue);
    const endingRevenue = parseFloat(formData.endingRevenue);
    const timeYears = parseFloat(formData.timeYears);
    
    // Calculate CAGR: ((EndValue / StartValue) ^ (1 / Years)) - 1
    const cagr = (Math.pow(endingRevenue / startingRevenue, 1 / timeYears) - 1) * 100;
    
    const dataToSubmit = {
      ...formData,
      startingRevenue,
      endingRevenue,
      timeYears,
      cagr,
      dateCreated: new Date()
    };
    
    const response = await onSubmit(dataToSubmit);
    
    if (response) {
      // Clear form and show success message
      setFormData({
        companyName: '',
        startingRevenue: '',
        endingRevenue: '',
        timeYears: '',
        startYear: '',
        endYear: ''
      });
      
      alert('Growth analysis data saved successfully!');
    }
  };
  
  return (
    <div className="form-container">
      <div className="form-section">
        <h3>Growth Analysis (CAGR)</h3>
        <p className="form-description">
          Track how fast revenue is growing year over year using the formula:
          <br />
          <strong>CAGR = [(Ending Revenue / Starting Revenue) ^ (1 / Years)] - 1</strong>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="startingRevenue">Starting Revenue (₹)</label>
            <input
              type="number"
              id="startingRevenue"
              name="startingRevenue"
              value={formData.startingRevenue}
              onChange={handleChange}
              min="1"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endingRevenue">Ending Revenue (₹)</label>
            <input
              type="number"
              id="endingRevenue"
              name="endingRevenue"
              value={formData.endingRevenue}
              onChange={handleChange}
              min="1"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startYear">Start Year</label>
              <input
                type="number"
                id="startYear"
                name="startYear"
                value={formData.startYear}
                onChange={handleChange}
                min="1900"
                max="2100"
                placeholder="e.g. 2020"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endYear">End Year</label>
              <input
                type="number"
                id="endYear"
                name="endYear"
                value={formData.endYear}
                onChange={handleChange}
                min="1900"
                max="2100"
                placeholder="e.g. 2023"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="timeYears">Time Period (Years)</label>
            <input
              type="number"
              id="timeYears"
              name="timeYears"
              value={formData.timeYears}
              onChange={handleChange}
              min="0.1"
              step="0.1"
              required
            />
          </div>
          
          {/* <div className="form-actions">
            <button type="submit" className="btn-submit">Submit</button>
          </div> */}
        </form>
      </div>
      
      <div className="chart-section">
        <h3>Growth Projection</h3>
        {chartData ? (
          <div className="chart-container">
            <Line
              data={chartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: false,
                    title: {
                      display: true,
                      text: 'Revenue (₹)'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Year'
                    }
                  }
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Revenue: ₹${context.parsed.y.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}`;
                      }
                    }
                  }
                }
              }}
            />
            
            {result && (
              <div className="result-summary">
                <h4>Calculated Result:</h4>
                <p>
                  <strong>CAGR:</strong> {result.cagr}%
                </p>
                <p>
                  <strong>Starting Revenue:</strong> ₹{result.startingRevenue.toLocaleString()}
                </p>
                <p>
                  <strong>Ending Revenue:</strong> ₹{result.endingRevenue.toLocaleString()}
                </p>
                <p>
                  <strong>Time Period:</strong> {result.timeYears} {result.timeYears === 1 ? 'Year' : 'Years'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="chart-placeholder">
            <p>Enter growth data to see real-time CAGR visualization</p>
            <p className="example">
              <strong>Example:</strong><br />
              Starting Revenue: ₹1,00,000<br />
              Ending Revenue: ₹2,00,000<br />
              Time: 3 Years<br />
              <br />
              CAGR = [(200000 / 100000) ^ (1/3)] - 1<br />
              = (2 ^ 0.3333) - 1<br />
              ≈ 0.26 or 26%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowthAnalysis;