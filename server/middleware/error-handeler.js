function notFound(req, res, next) {
    res.status(404).send('Not Found');
}

function errorHandler(err, req, res, next) {
    console.error(err);
    const status = err && err.status ? err.status : 500;
    res.status(status).send('Server Error');
}

module.exports = { notFound, errorHandler };