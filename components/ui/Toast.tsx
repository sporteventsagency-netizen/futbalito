import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Effect to show the toast when the message changes
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Allow time for fade-out animation before calling onClose
        setTimeout(onClose, 300);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  return (
    <div 
      className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-2xl text-white transition-all duration-300 ease-in-out
                  ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                  bg-gray-800`}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

export default Toast;