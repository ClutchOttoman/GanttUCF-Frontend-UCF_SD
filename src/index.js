
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


const RootComponent = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      document.body.style.visibility = 'visible'; // Ensure styles apply before rendering
      setIsLoaded(true);
    }, 50); // Reduced delay
  }, []);

  return isLoaded ? <App /> : null;
};



const root = ReactDOM.createRoot(document.getElementById('root'));

setTimeout(() => {
  root.render(
    <React.StrictMode>
      <RootComponent />
    </React.StrictMode>
  );
}, 0); // Ensure styles apply before React initializes

reportWebVitals();

