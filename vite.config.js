import { defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';
import path from 'path';

export default defineConfig({
  plugins: [vue2()],
  server: {
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    chunkSizeWarningLimit: 1100, // Increased limit to avoid warnings for large Bootstrap libraries
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core libraries
          if (id.includes('node_modules/vue/') || id.includes('node_modules/vuex/') || id.includes('node_modules/vue-router/')) {
            return 'vendor-core';
          }
          
          // Bootstrap and related libraries
          if (id.includes('node_modules/bootstrap/')) {
            return 'ui-bootstrap';
          }
          if (id.includes('node_modules/bootstrap-vue/')) {
            return 'ui-bootstrap-vue';
          }
          if (id.includes('node_modules/@popperjs/')) {
            return 'ui-popper';
          }
          
          // Application features based on views
          if (id.includes('/src/views/ProductDetails.vue') || id.includes('/src/views/Products.vue')) {
            return 'product-features';
          }
          if (id.includes('/src/views/Cart.vue') || id.includes('/src/views/Checkout.vue') || 
              id.includes('/src/views/Shipping.vue') || id.includes('/src/views/Success.vue')) {
            return 'checkout-features';
          }
          if (id.includes('/src/views/Home.vue') || id.includes('/src/views/Contact.vue')) {
            return 'home-contact';
          }
        },
        // Ensure chunking strategy is optimized
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    }
  }
});
