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
    chunkSizeWarningLimit: 800, // Increase from default 500kb to 800kb
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor dependencies into separate chunks
          'vendor': ['vue', 'vuex', 'vue-router'],
          'ui-libs': ['bootstrap', 'bootstrap-vue'], 
          // Split larger application modules based on features
          'product-features': ['./src/views/ProductDetails.vue', './src/views/Products.vue'],
          'checkout-features': ['./src/views/Cart.vue', './src/views/Checkout.vue', './src/views/Shipping.vue', './src/views/Success.vue'],
          'home-contact': ['./src/views/Home.vue', './src/views/Contact.vue']
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
