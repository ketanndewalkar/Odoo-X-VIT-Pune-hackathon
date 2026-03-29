import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import QueryProvider from "./provider/QueryProvider.jsx";
import "./services/api/interceptors.js";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  </StrictMode>,
)
