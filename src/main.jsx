import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'          // khởi tạo i18n trước khi render
import App from './App.jsx'
import { NotifyProvider } from '@/context/NotifyContext.jsx'
import { WebSocketProvider } from '@/context/WebSocketContext.jsx'
import { SettingsProvider } from '@/context/SettingsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotifyProvider>
      <WebSocketProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </WebSocketProvider>
    </NotifyProvider>
  </StrictMode>,
)

