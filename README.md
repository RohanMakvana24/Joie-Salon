# Classic Cut Salon — Next.js

Next.js App Router migration of the Classic Cut Salon Rajkot website. The original Vite project remains separate and unchanged.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm test
npm run build
```

The site uses Next.js 15, React 19, and Tailwind CSS 4. The landing page is statically prerendered; interactive sections run as client components. Three.js lanyard rendering is loaded only in the browser. Shared content lives in `src/data`, and static images and fonts are in `public`.
