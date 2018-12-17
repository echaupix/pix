const mongoose = require('mongoose');
const uuid = require('uuid');

// A helper validator function that allows nulls or integers.
const isInteger = val => val === null || Number.isInteger(val);

/**
 * @class
 *
 * A mongoose model representing a movie.
 *
 * @param {Object} properties - An object of initial movie properties.
 *
 * @property {String} id - The movie id.
 * @property {String} name - The name of the movie.
 * @property {String} director - The full name of the director.
 * @property {Array<String>} genres - A list of genres associated with the movie.
 * @property {String} content_rating - The MPAA movie rating (G, PG, PG-13, R, etc).
 * @property {Date} release_date - When the movie was released in theaters.
 * @property {Number} duration - The runtime of the movie in minutes.
 * @property {Number} budget - The cost of the movie in USD ($).
 * @property {Number} rating - The critics rating. A value between 0-5.
 */
const Movie = new mongoose.Schema({
    _id: { type: String, default: uuid.v4, required: true },
    name: { type: String, required: true },
    director: { type: String },
    genres: { type: [String], required: true },
    content_rating: { type: String },
    release_date: { type: Date, required: true },
    duration: { type: Number, validate: isInteger },
    budget: { type: Number, validate: isInteger },
    rating: { type: Number, required: false },
});

Movie.options.toJSON = {
    // when we serialize a movie to json, remove the internal mongo properties.
    transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Movie', Movie);
