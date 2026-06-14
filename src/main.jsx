import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import './i18n'          // khởi tạo i18n trước khi render
import App from './App.jsx'
import { NotifyProvider } from '@/context/NotifyContext.jsx'

// Khởi tạo QueryClient để quản lý cache và state API
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tránh tự động refetch khi người dùng đổi tab nếu không cần thiết
      retry: 1, // Thử lại tối đa 1 lần nếu API lỗi
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotifyProvider>
        <App />
      </NotifyProvider>
    </QueryClientProvider>
  </StrictMode>,
)

