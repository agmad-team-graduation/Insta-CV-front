import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> 
  </StrictMode>,
)
