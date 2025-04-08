import React, { useEffect, useRef } from 'react';
// Just import Chart directly from our global config to ensure consistency
import Chart from '../../chartConfig';
import './Charts.css';

const CAGRChart = ({ data, showLegend = false, detailed = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    
    // Destroy existing chart instance before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create new chart instance
    if (data && data.length > 0) {
      // Extract companies and their CAGR values
      const companies = data.map(item => item.companyName);
      const cagrValues = data.map(item => item.cagr || 0);
      const backgroundColors = data.map((_, idx) => getColor(idx, 0.7));

      // Add other metrics if detailed view
      let datasets = [
        {
          label: 'CAGR (%)',
          data: cagrValues,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }
      ];

      // Include additional metrics in detailed view
      if (detailed) {
        datasets = [
          ...datasets,
          {
            label: 'Profit Margin (%)',
            data: data.map(item => item.profitMargin || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            type: 'line'
          },
          {
            label: 'ROI (%)',
            data: data.map(item => item.roi || 0),
            backgroundColor: 'rgba(153, 102, 255, 0.7)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            type: 'line'
          }
        ];
      }

      // Add a small timeout to ensure DOM is ready
      setTimeout(() => {
        try {
          chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: companies,
              datasets: datasets
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Percentage (%)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Company'
                  }
                }
              },
              plugins: {
                legend: {
                  display: showLegend || detailed,
                  position: 'top',
                },
                title: {
                  display: detailed,
                  text: 'Growth Metrics Comparison'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += `${context.parsed.y.toFixed(2)}%`;
                      }
                      return label;
                    }
                  }
                }
              },
              indexAxis: companies.length > 6 ? 'y' : 'x', // Use horizontal bar chart for many companies
            }
          });
        } catch (error) {
          console.error('Error creating chart:', error);
        }
      }, 10);
    }
    
    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, showLegend, detailed]);

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
      <canvas ref={chartRef} key={`cagr-chart-${data?.length || 'empty'}`}></canvas>
      {data.length === 0 && (
        <div className="no-data-message">No growth data available</div>
      )}
    </div>
  );
};

export default CAGRChart;
