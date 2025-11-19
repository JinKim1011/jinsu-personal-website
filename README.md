# Portfolio Website

## About
- **Description:** A personal blog and portfolio built with Node.js, Express, EJS and MongoDB. It provides server-side routes for pages and an admin/API interface to manage posts, and serves static client assets from the `/client` folder.
- **Features:** Create, read, update, and delete blog posts via the admin interface; session-based admin access; persistent sessions stored in MongoDB when `MONGODB_URI` is set.

## How to run
- **Requirements:** `Node.js`, `npm`, and a running MongoDB instance if you want persistent storage.
- **Install dependencies:**

	```bash
	npm install
	```

- **Environment:** Create a `.env` file in the project root with at least the following variables:

	- `MONGODB_URI` — MongoDB connection string (optional for local dev)
	- `SESSION_SECRET` — a secret string used to sign session cookies.
	- `PORT` — optional, defaults to `3000`.

- **Start the app:**

	- Production (`node`): `npm start`
	- Development with auto-reload: `npm run dev`
	- Serve static client only (no server): `npm run serve:static` (serves `client/` on port `8080`)

- **Open in browser:** After `npm start` (default), visit `http://localhost:3000`.

## How to manage posts
- **Admin UI:** Open `http://localhost:3000/admin` (server-admin route) or use the client `client/admin.html` page to sign in and manage posts. The admin UI can create, edit, and delete posts.
- **API:** The server exposes admin API routes under `/api/admin` for programmatic management. See `server/routes/admin.js` and `server/routes/api.js`.
- **Data model:** Posts are stored in MongoDB using the `Post` model defined in `server/models/Post.js`.
- **When admin pages show login:** Authentication is handled by server middleware in `server/middleware/auth-middleware.js`. Ensure your admin credentials or auth setup are configured according to your deployment.

## Tech Specs
- **Runtime:** Node.js + Express
- **Templating:** EJS views in `server/views` (page templates) and static client files in `client/`.
- **Database:** MongoDB (via `mongoose`). Session storage uses `connect-mongo` when `MONGODB_URI` is provided.
- **Dev tools:** `nodemon` for development (`npm run dev`), ESLint and Prettier in devDependencies.

## Useful files & locations
- `server.js` — application entrypoint and config
- `server/routes/` — route handlers (`pages`, `api`, `admin`)
- `server/models/Post.js` — post schema and model
- `client/` — static front-end (HTML, CSS)
- `server/views/` — EJS templates for server-rendered pages