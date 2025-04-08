import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './Charts.css';

const RevenueChart = ({ data, showLegend = false, detailed = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Process revenue data for charting
    const processedData = processRevenueData(data);
    
    // Create or update chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = createRevenueChart(ctx, processedData, showLegend, detailed);
    
    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, showLegend, detailed]);

  // Process revenue data for chart format
  const processRevenueData = (data) => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Create a set of unique time periods (e.g., Q1 2022, Q2 2022)
    const allPeriods = new Set();
    data.forEach(company => {
      if (company.revenue && company.revenue.length > 0) {
        company.revenue.forEach(rev => {
          allPeriods.add(`Q${rev.quarter} ${rev.year}`);
        });
      }
    });

    // Sort periods chronologically
    const sortedPeriods = Array.from(allPeriods).sort((a, b) => {
      const [aQ, aYear] = a.split(' ');
      const [bQ, bYear] = b.split(' ');
      return aYear - bYear || aQ.substring(1) - bQ.substring(1);
    });

    // Create dataset for each company
    const datasets = data.map((company, index) => {
      const revenueMap = {};
      
      // Create a map of periods to revenue amounts
      if (company.revenue) {
        company.revenue.forEach(rev => {
          const period = `Q${rev.quarter} ${rev.year}`;
          revenueMap[period] = rev.amount;
        });
      }
      
      // Create data array with values for each period
      const revenueData = sortedPeriods.map(period => revenueMap[period] || null);
      
      return {
        label: company.companyName,
        data: revenueData,
        fill: false,
        borderColor: getColor(index),
        backgroundColor: getColor(index, 0.1),
        tension: 0.1
      };
    });

    return {
      labels: sortedPeriods,
      datasets: datasets
    };
  };

  // Create revenue chart
  const createRevenueChart = (ctx, chartData, showLegend, detailed) => {
    return new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: showLegend,
            position: 'top',
          },
          title: {
            display: detailed,
            text: 'Revenue Trends Over Time'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Quarter/Year'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue (USD)'
            },
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(value);
              }
            }
          }
        }
      }
    });
  };

  // Generate colors for chart series
  const getColor = (index, alpha = 1) => {
    const colors = [
      `rgba(255, 99, 132, ${alpha})`,
      `rgba(54, 162, 235, ${alpha})`,
      `rgba(255, 206, 86, ${alpha})`,
      `rgba(75, 192, 192, ${alpha})`,
      `rgba(153, 102, 255, ${alpha})`,
      `rgba(255, 159, 64, ${alpha})`,
      `rgba(199, 199, 199, ${alpha})`,
      `rgba(83, 102, 255, ${alpha})`,
      `rgba(40, 159, 64, ${alpha})`,
      `rgba(210, 199, 199, ${alpha})`
    ];
    
    return colors[index % colors.length];
  };

  return (
    <div className={`chart-container ${detailed ? 'detailed' : ''}`}>
      <canvas ref={chartRef}></canvas>
      {data.length === 0 && (
        <div className="no-data-message">No revenue data available</div>
      )}
    </div>
  );
};

export default RevenueChart;