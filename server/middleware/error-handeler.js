function notFound(response) {
    response.status(404).send('Not Found');
}

function errorHandler(error, response) {
    console.error(error);
    const status = error && error.status ? error.status : 500;
    response.status(status).send('Server Error');
}

module.exports = { notFound, errorHandler };