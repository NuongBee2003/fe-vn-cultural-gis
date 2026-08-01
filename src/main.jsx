import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import './i18n'          // khởi tạo i18n trước khi render
import App from './App.jsx'
import { NotifyProvider } from '@/context/NotifyContext.jsx'
import { WebSocketProvider } from '@/context/WebSocketContext.jsx'
import { SettingsProvider } from '@/context/SettingsContext.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotifyProvider>
        <WebSocketProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </WebSocketProvider>
      </NotifyProvider>
    </QueryClientProvider>
  </StrictMode>,
)

