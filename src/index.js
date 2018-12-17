const MovieService = require('./MovieService');

const PORT = 5000;
const DEFAULT_MONGO_HOST = 'localhost';
const DB_NAME = 'movies';

const mongoHost = process.env.MONGO_HOST || DEFAULT_MONGO_HOST;
const service = new MovieService(PORT, mongoHost, DB_NAME);
service.start();
