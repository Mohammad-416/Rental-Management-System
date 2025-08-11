import React, { useState, useEffect } from 'react';

const AnimatedRingLogo = ({ isDarkMode = false, size = 60 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on component mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`ring-logo-container ${isVisible ? 'animate-in' : ''}`}>
      <style jsx>{`
        .ring-logo-container {
          position: relative;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          opacity: 0;
          transform: scale(0.8) rotate(-10deg);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .ring-logo-container.animate-in {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        /* Main Ring Container */
        .ring-system {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: ${isDarkMode 
            ? 'radial-gradient(circle at 30% 30%, rgba(76,205,196,0.15), rgba(255,107,107,0.15))' 
            : 'radial-gradient(circle at 30% 30%, rgba(59,130,246,0.15), rgba(139,92,246,0.15))'
          };
          backdrop-filter: blur(10px);
          border: 1px solid ${isDarkMode ? 'rgba(76,205,196,0.2)' : 'rgba(59,130,246,0.2)'};
          box-shadow: 
            0 8px 32px ${isDarkMode ? 'rgba(76,205,196,0.1)' : 'rgba(59,130,246,0.1)'},
            inset 0 1px 0 rgba(255,255,255,0.1);
          animation: mainRingPulse 4s ease-in-out infinite;
        }

        .ring-system::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 50%;
          background: ${isDarkMode 
            ? 'conic-gradient(from 0deg, #4ecdc4, #ff6b6b, #4ecdc4)' 
            : 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)'
          };
          z-index: -1;
          animation: gradientRotate 6s linear infinite;
          opacity: 0.6;
        }

        /* Outer Ripple Rings */
        .ripple-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 2px solid ${isDarkMode ? 'rgba(76,205,196,0.3)' : 'rgba(59,130,246,0.3)'};
          animation: rippleExpand 3s ease-out infinite;
        }

        .ripple-ring:nth-child(1) {
          width: 100%;
          height: 100%;
          animation-delay: 0s;
        }

        .ripple-ring:nth-child(2) {
          width: 120%;
          height: 120%;
          animation-delay: 1s;
        }

        .ripple-ring:nth-child(3) {
          width: 140%;
          height: 140%;
          animation-delay: 2s;
        }

        /* Inner Core */
        .ring-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60%;
          height: 60%;
          border-radius: 50%;
          background: ${isDarkMode 
            ? 'linear-gradient(135deg, #4ecdc4, #ff6b6b)' 
            : 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
          };
          box-shadow: 
            0 4px 16px ${isDarkMode ? 'rgba(76,205,196,0.4)' : 'rgba(59,130,246,0.4)'},
            inset 0 1px 0 rgba(255,255,255,0.2);
          animation: coreRotate 8s linear infinite;
        }

        .ring-core::before {
          content: '';
          position: absolute;
          top: 10%;
          left: 20%;
          width: 30%;
          height: 30%;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          animation: highlight 2s ease-in-out infinite alternate;
        }

        /* Floating Particles */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${isDarkMode ? '#4ecdc4' : '#3b82f6'};
          opacity: 0.7;
          animation: particleFloat 5s ease-in-out infinite;
        }

        .particle:nth-child(1) {
          top: 10%;
          left: 50%;
          animation-delay: 0s;
        }

        .particle:nth-child(2) {
          top: 50%;
          right: 10%;
          animation-delay: 1.5s;
        }

        .particle:nth-child(3) {
          bottom: 10%;
          left: 50%;
          animation-delay: 3s;
        }

        .particle:nth-child(4) {
          top: 50%;
          left: 10%;
          animation-delay: 4.5s;
        }

        /* Progress Arc */
        .progress-arc {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top: 3px solid ${isDarkMode ? '#4ecdc4' : '#3b82f6'};
          animation: progressSpin 2s linear infinite;
          opacity: 0.8;
        }

        /* Keyframe Animations */
        @keyframes mainRingPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 
              0 8px 32px ${isDarkMode ? 'rgba(76,205,196,0.1)' : 'rgba(59,130,246,0.1)'},
              inset 0 1px 0 rgba(255,255,255,0.1);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 
              0 12px 40px ${isDarkMode ? 'rgba(76,205,196,0.2)' : 'rgba(59,130,246,0.2)'},
              inset 0 1px 0 rgba(255,255,255,0.1);
          }
        }

        @keyframes gradientRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes rippleExpand {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          70% {
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }

        @keyframes coreRotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes highlight {
          0% {
            opacity: 0.3;
            transform: scale(1);
          }
          100% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-8px) scale(1.1);
            opacity: 1;
          }
          50% {
            transform: translateY(-4px) scale(0.9);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-12px) scale(1.2);
            opacity: 0.9;
          }
        }

        @keyframes progressSpin {
          0% {
            transform: rotate(0deg);
            border-top-color: ${isDarkMode ? '#4ecdc4' : '#3b82f6'};
          }
          25% {
            border-top-color: ${isDarkMode ? '#ff6b6b' : '#8b5cf6'};
          }
          50% {
            border-top-color: ${isDarkMode ? '#4ecdc4' : '#06b6d4'};
          }
          75% {
            border-top-color: ${isDarkMode ? '#ff6b6b' : '#3b82f6'};
          }
          100% {
            transform: rotate(360deg);
            border-top-color: ${isDarkMode ? '#4ecdc4' : '#3b82f6'};
          }
        }

        /* Hover Effects */
        .ring-logo-container:hover .ring-system {
          transform: scale(1.1);
          box-shadow: 
            0 16px 48px ${isDarkMode ? 'rgba(76,205,196,0.3)' : 'rgba(59,130,246,0.3)'},
            inset 0 1px 0 rgba(255,255,255,0.15);
        }

        .ring-logo-container:hover .ring-core {
          animation-duration: 4s;
        }

        .ring-logo-container:hover .progress-arc {
          animation-duration: 1s;
        }

        /* Responsive Scaling */
        @media (max-width: 768px) {
          .ring-logo-container {
            width: ${size * 0.8}px;
            height: ${size * 0.8}px;
          }
        }

        @media (max-width: 480px) {
          .ring-logo-container {
            width: ${size * 0.7}px;
            height: ${size * 0.7}px;
          }
        }
      `}</style>

      {/* Ripple Rings */}
      <div className="ripple-ring"></div>
      <div className="ripple-ring"></div>
      <div className="ripple-ring"></div>

      {/* Main Ring System */}
      <div className="ring-system">
        {/* Progress Arc */}
        <div className="progress-arc"></div>
        
        {/* Inner Core */}
        <div className="ring-core"></div>
        
        {/* Floating Particles */}
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </div>
  );
};

export default AnimatedRingLogo;
