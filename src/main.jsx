import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from './contexts/SearchContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <AuthProvider>
      <BrowserRouter>
      <SearchProvider>
    <App />
    </SearchProvider>
    </BrowserRouter>
    </AuthProvider>
  
  </StrictMode>,
)
