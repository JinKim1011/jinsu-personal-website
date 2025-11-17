require('dotenv').config(); // load environment variables

// core
const express = require('express');
const session = require('express-session');
const path = require('path');

// routes & middleware
const pagesRouter = require('./server/routes/pages');
const adminRoutes = require('./server/routes/admin');
const apiRouter = require('./server/routes/api');
const errorHandler = require('./server/middleware/error-handeler');

// database
const { connectToDatabase } = require('./server/config/db');

const app = express();

// session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
}));

// view ejs
app.set('view engine', 'ejs');

// body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', './server/views');

// static assets (client/)
app.use(express.static(path.join(__dirname, 'client'), { index: false }));

// mount pages, api, admin routers
app.use('/', pagesRouter);
app.use('/api', apiRouter);
app.use('/api/admin', adminRoutes);

// health route
const { healthHandler } = require('./server/middleware/health');

// health route
app.get('/health', healthHandler);

// error handlers
app.use(errorHandler.notFound);
app.use(errorHandler.errorHandler);

// start server
const port = process.env.PORT || 3000;
(async () => {
    await connectToDatabase(process.env.MONGODB_URI); // e.g., mongodb://127.0.0.1:27017/portfolio
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
})();

module.exports = app;