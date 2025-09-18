import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login.tsx'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* صفحة تسجيل الدخول */}
        <Route path="/login" element={<Login />} />

        {/* أي راوت ثاني لازم توكن */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <App />
          
            </ProtectedRoute>
          }
        />
      </Routes>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  </StrictMode>,
)
