import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  server: { 
    proxy: { 
      '/api': ' http://127.0.0.1:5000'
    }
  },
})
