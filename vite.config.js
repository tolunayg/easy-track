import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000 // Configure Vite to run on port 3000
  },
  // Define process.env variables
  define: {
    'process.env': process.env
  }
});
