import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "react-datepicker/dist/react-datepicker.css";
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from './contexts/SearchContext.jsx'
import { BookingProvider } from './contexts/BookingContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <AuthProvider>
      <BrowserRouter>
        <SearchProvider>
          <BookingProvider>
            <App />
          </BookingProvider>
        </SearchProvider>
      </BrowserRouter>
    </AuthProvider>

  </StrictMode>,
)
