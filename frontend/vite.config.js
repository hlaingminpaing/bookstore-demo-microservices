// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Route recommendations to Python Service (Port 5000)
      '/api/recommendations': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Route all other API requests to Node.js Backend (Port 3001)
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})