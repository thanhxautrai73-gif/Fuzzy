import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Quản lý Service Worker cho PWA
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker đã đăng ký thành công trong Production:', registration.scope);
      })
      .catch((error) => {
        console.error('Đăng ký Service Worker thất bại:', error);
      });
  });
} else if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  // Hủy đăng ký Service Worker cũ trong chế độ Dev để tránh cache nhầm mã nguồn cũ
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('Đã hủy đăng ký Service Worker cũ trong chế độ Dev.');
          window.location.reload();
        }
      });
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
