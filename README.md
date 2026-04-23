# VibeGen

VibeGen is an immersive quote generator with category filters, favorite storage, social sharing, and a highly stylized neon visual system.

## Production-Ready Stack

- Vite for local development and production builds
- Tailwind CSS (via PostCSS) for utility classes
- ESLint for JavaScript quality checks
- Modular source split under `src/`

## Project Structure

```text
.
|- index.html
|- src/
|  |- main.js
|  |- styles.css
|- vite.config.js
|- tailwind.config.js
|- postcss.config.js
|- eslint.config.js
|- package.json
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build locally:

```bash
npm run preview
```

## Quality Checks

Run linting:

```bash
npm run lint
```

Auto-fix lint issues when possible:

```bash
npm run lint:fix
```

## Deployment

Deploy the generated `dist/` folder to any static host, including:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

Build command:

```bash
npm run build
```

Publish directory:

```text
dist
```
