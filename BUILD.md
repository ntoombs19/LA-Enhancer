# Build and Deployment Guide

This document explains how to build and deploy the LA Enhancer script using Vite, a fast and modern build tool.

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Development server (with hot reload):**
   ```bash
   npm run dev
   ```

3. **Preview production build:**
   ```bash
   npm run preview
   ```

5. **Production build:**
   ```bash
   npm run build
   ```

6. **Clean build artifacts:**
   ```bash
   npm run clean
   ```

## Build Output

The Vite build process creates a `dist/` directory with:

- `js/main.min.js` - Minified main script (35KB, optimized)
- `lib/` - Library files (jstorage.js, taffy.js)
- `lang/` - All 27 language files (preserved without minification)
- `css/` - Stylesheets
- `images/` - Image assets
- `index.html` - GitHub Pages landing page
- `notify.js` and `resources.js` - Additional script files

**Build Performance:**
- ⚡ **Fast builds:** ~200ms (vs 300ms+ with Webpack)
- 📦 **Smaller dependencies:** 68 packages (vs 405 with Webpack)
- 🔥 **Hot reload:** Instant updates during development

## GitHub Actions Deployment

The project uses GitHub Actions to automatically build and deploy to GitHub Pages:

1. **Trigger:** Push to `main` or `master` branch
2. **Build:** Runs `npm run build` 
3. **Deploy:** Uploads `dist/` folder to GitHub Pages

## Manual Deployment

If you need to deploy manually:

1. Run the production build:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains all files needed for deployment

3. Upload the contents of `dist/` to your web server or GitHub Pages

## Script URLs

After deployment, the script will be available at:
- Production: `https://ntoombs19.github.io/LA-Enhancer/js/main.min.js`
- Development: `https://ntoombs19.github.io/LA-Enhancer/js/main.js`

## Bookmarklet

Users can install the script using this bookmarklet:
```javascript
javascript:$.ajaxSetup({dataType:"script"});$.getScript('https://ntoombs19.github.io/LA-Enhancer/js/main.min.js');void 0;
```

## Configuration

The build system is configured in:
- `vite.config.js` - Vite build configuration with custom asset copying
- `package.json` - npm scripts and dependencies
- `.github/workflows/build-and-deploy.yml` - GitHub Actions workflow

**Vite Features Used:**
- Custom asset copying plugin for userscript dependencies
- Terser minification with console removal in production
- Development server with hot reload
- Optimized build output structure

## Troubleshooting

- **Build fails:** Check that all dependencies are installed with `npm install`
- **Missing files:** Ensure all source files exist in their expected locations
- **GitHub Pages not updating:** Check the Actions tab for build/deploy status
- **Script not loading:** Verify the GitHub Pages URL is correct and accessible
