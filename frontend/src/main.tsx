import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './styles/index.css'
import App from './App'

// The portal (login, partner dashboard, admin) is a separate chunk, loaded only when visited.
const PortalApp = lazy(() => import('./portal/PortalApp'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/*"
          element={
            <Suspense fallback={<div className="min-h-svh bg-ivory" />}>
              <PortalApp />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
