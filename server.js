require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
app.set('view engine', 'ejs')
app.set('views', './server/views/pages')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client')));
module.exports = app;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
app.get('/work', (req, res) => {
    res.render('work')
});
app.get('/blog', (req, res) => {
    res.render('blog')
});
app.get('/admin', (req, res) => {
    res.render('admin')
});
app.get('/password', (req, res) => {
    res.render('password')
});
app.get('/edit', (req, res) => {
    res.render('edit')
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
module.exports = app;

// Admin routes
const adminRoutes = require('./server/routes/admin');
app.use('/api/admin', adminRoutes);