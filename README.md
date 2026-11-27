# Portfolio

Personal portfolio of Krinal Naghera: software engineer working on site reliability, observability, backend systems, data engineering and applied AI.

## Tech

- **Frontend:** React 19, Vite 7, plain CSS, `react-icons`
- **Hosting:** Vercel, with Vercel Analytics
- **Content:** all text (experience, projects, education, certificates) lives in [`src/constants.js`](src/constants.js)

## Run locally

```bash
npm install
npm run dev      # frontend on http://localhost:5173
npm run build    # production build into dist/
npm run lint
```

## Updating content

Edit the arrays in `src/constants.js`. Certificate images go in `public/certificates/` and are referenced by path from `certificateItems`.
