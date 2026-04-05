import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 443,
    https: {
      key: fs.readFileSync('ssl/animeplayer.key'),
      cert: fs.readFileSync('ssl/animeplayer.crt'),
    }
  }
})
