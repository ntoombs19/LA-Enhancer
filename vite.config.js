import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';

// Custom plugin to copy assets to the correct structure
function copyAssetsPlugin() {
  return {
    name: 'copy-assets',
    writeBundle() {
      const copyDir = (src, dest) => {
        if (!existsSync(dest)) {
          mkdirSync(dest, { recursive: true });
        }
        const entries = readdirSync(src);
        for (const entry of entries) {
          const srcPath = resolve(src, entry);
          const destPath = resolve(dest, entry);
          if (statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            copyFileSync(srcPath, destPath);
          }
        }
      };

      // Copy assets to dist
      try {
        copyDir('js/lib', 'dist/lib');
        copyDir('lang', 'dist/lang');
        copyDir('css', 'dist/css');
        copyDir('images', 'dist/images');
        copyFileSync('js/notify.js', 'dist/notify.js');
        copyFileSync('js/resources.js', 'dist/resources.js');
        
        // Move index.html from src/ to root of dist/
        if (existsSync('dist/src/index.html')) {
          copyFileSync('dist/src/index.html', 'dist/index.html');
        }
      } catch (error) {
        console.warn('Some assets could not be copied:', error.message);
      }
    }
  };
}

export default defineConfig({
  root: '.',
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'js/main.js'),
        index: resolve(__dirname, 'src/index.html')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'main' ? 'js/main.min.js' : '[name].js';
        },
        assetFileNames: 'assets/[name][extname]'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
      format: {
        comments: false,
      },
    }
  },
  
  server: {
    port: 3000,
    open: '/src/index.html'
  },
  
  preview: {
    port: 4173,
    open: true
  },
  
  plugins: [copyAssetsPlugin()]
});
