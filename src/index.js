import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// src/index.js or src/index.tsx
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS
import 'bootstrap';  // Import Bootstrap JS (includes all JS plugins)

import { AuthProvider } from "./utility/AuthContext";

import { ThemeProvider } from './ThemeContext'; 
import QuestionProvider from './utility/QuestionProvider';
import { ScreenSizeProvider } from './ScreenSizeContext ';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ScreenSizeProvider>
    <AuthProvider>
      <QuestionProvider>
      <ThemeProvider>
    <App />
    </ThemeProvider>
    </QuestionProvider>
    </AuthProvider>
    </ScreenSizeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
