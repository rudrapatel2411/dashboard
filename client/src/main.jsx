import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const savedTheme = localStorage.getItem('dashboard-theme');
if (savedTheme === 'dark') {
  document.documentElement.dataset.theme = 'dark';
  document.documentElement.style.colorScheme = 'dark';
} else {
  document.documentElement.dataset.theme = 'light';
  document.documentElement.style.colorScheme = 'light';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
