import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'checkout-api',
      configureServer(server) {
        server.middlewares.use(express.json());
        
        server.middlewares.use('/api/saveCheckout', async (req, res) => {
          if (req.method === 'POST') {
            try {
              const checkoutData = req.body;
              const filePath = path.resolve('roomdata.json');
              
              let existingData = [];
              try {
                const fileContent = await fs.readFile(filePath, 'utf-8');
                existingData = JSON.parse(fileContent);
              } catch (error) {
                // File doesn't exist yet, start with empty array
              }
              
              existingData.push(checkoutData);
              await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (error) {
              console.error('Error saving checkout data:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to save checkout data' }));
            }
          } else {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
          }
        });
      },
    },
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 7777
  }
});