import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = ({ onFormChange }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Sample slides data - replace with actual content
  const slides = [
    {
      id: 1,
      title: "Track Your Revenue Performance",
      description: "Use our Revenue Tracking tool to monitor customer value and revenue trends",
      image: "https://img.freepik.com/free-vector/people-work-with-business-analytic-data_107791-10413.jpg?t=st=1744027411~exp=1744031011~hmac=c1be417ba52121d53eeb6846cf78657d4e5a3046189dc095ad7bea3a3a8b7858&w=2000",
      buttonText: "Try Revenue Tracking",
      action: "revenue"
    },
    {
      id: 2,
      title: "Analyze Your Growth Metrics",
      description: "Calculate CAGR and visualize your company's growth trajectory over time",
      image: "https://img.freepik.com/free-vector/two-young-businessmen-are-determined-work-one-is-successful-another-one-failed-work-flat-vector-illustration-design_1150-56717.jpg?t=st=1744027533~exp=1744031133~hmac=728881c85127384d3d62d9fb1bfed1eca2e2cccb176c87861d92407e37c6830b&w=2000",
      buttonText: "Explore Growth Analysis",
      action: "growth"
    },
    {
      id: 3,
      title: "Understand Your Profit & ROI",
      description: "Get insights into your profit margins and return on investment",
      image: "https://img.freepik.com/free-vector/salary-difference-society-structure-hierarchy_107791-13918.jpg?t=st=1744027587~exp=1744031187~hmac=a8ca6dfba8e9977aa4371cff3171216a0ad20d5ff50bc2e27b73a13daf70144d&w=2000",
      buttonText: "Check Profit & ROI",
      action: "profit"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearTimeout(timer);
  }, [currentSlide, slides.length]);

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const handleButtonClick = (action) => {
    if (onFormChange) {
      onFormChange(action);
    }
  };

  return (
    <div className="slideshow">
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})` }}
          >
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              <button 
                className="slide-button" 
                onClick={() => handleButtonClick(slide.action)}
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="slide-arrow prev" onClick={goToPrevSlide}>&#10094;</button>
      <button className="slide-arrow next" onClick={goToNextSlide}>&#10095;</button>
      
      <div className="dots-container">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;