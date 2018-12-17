const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const Movie = require('./models/Movie');

/**
 * A simple service for interacting a database of movies.
 *
 * See README.md for more details.
 */
class MovieService {
    constructor(port, dbHost, dbName) {
        // stash away the port number
        this._port = port;
        this._dbUrl = `mongodb://${dbHost}/${dbName}`;

        // create our express app
        this._app = express();

        // setup morgan for request logging
        this._app.use(morgan('combined'));

        // setup the json body parser for payload bodies
        this._app.use(bodyParser.json());

        // register our routes
        this._app.get('/movies', (req, res) => this.getAllMovies(req, res));
        this._app.post('/movies', (req, res) => this.createMovie(req, res));
        this._app.get('/movies/:id', (req, res) => this.getMovieById(req, res));

    }

    /**
     * Starts the API server.
     *
     * @returns {undefined}
     */
    start() {
        // set up our mongodb connection
        mongoose.connect(this._dbUrl);

        // startup the http server
        this._app.listen(this._port, () => {
            // log when server is up and running
            // eslint-disable-next-line no-console
            console.log(`PIX Movie Service listening on port ${this._port}`);
        });
    }

    /**
     * Gets all movies from mongodb and sends them on the response.
     *
     * If there is an error while fetching the movies, this will send a 500
     *
     * @param {http.IncomingMessage} req - The incoming HTTP request.
     * @param {http.ServerResponse} res - The outgoing HTTP response.
     */
    async getAllMovies(req, res) {
        try {
            const movies = await Movie.find();
            res.send(movies);
        } catch (error) {
            res.status(500).send({message: error.message });
        }

    }

    /**
     * Creates a new movie object in mongodb.
     *
     * Will send a 400 if the movie doesn't pass validation.
     * Will send a 500 if there is an error while trying to save.
     *
     * @param {http.IncomingMessage} req - The incoming HTTP request.
     * @param {http.ServerResponse} res - The outgoing HTTP response.
     */
    async createMovie(req, res) {
        const movie = this._createMovieModel(req.body);
        try {
            await movie.save();
            res.status(201).end();
        } catch(error) {
            if (error.name === 'ValidationError') {
                res.status(400).send({ message: error.message });
            } else {
                res.status(500).end();
            }
        }
    }

    /**
     * Gets a specific movie by id.
     *
     * Will send a 404 if movie is not found.
     * Will send a 500 if there is an error fetching the movie.
     *
     * @param {http.IncomingMessage} req - The incoming HTTP request.
     * @param {http.ServerResponse} res - The outgoing HTTP response.
     */
    async getMovieById(req, res) {
        try {
            const movie = await Movie.findById(req.params.id);
            if (!movie) {
                return res.status(404).end();
            }
            res.send(movie);
        } catch (error) {
            res.status(500).send({message: error.message });
        }
    }

    /**
     * A little wrapper around creating movie models to allow for easy
     * mocking in testing.
     *
     * @param {Object} properties - The movie properties.
     * @returns {Movie} - An instance of a Movie model.
     */
    _createMovieModel(properties) {
        return new Movie(properties);
    }
}

module.exports = MovieService;
