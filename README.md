# PIX Movie Service (JavaScript)

This repository contains an example RESTful API to query for movies. This
service is built in nodejs 8 using
[express](https://expressjs.com/) for API
routing and [MongoDB](https://www.mongodb.com) using
[mongoose](https://mongoosejs.com/) for persistence.

As part of your interview process, we ask that you spend a few hours showing
off your coding skills by implementing the following feature:

> As a consumer of the `/movies` API, I would like to filter the results by date
> range, director and genre.

After you have completed your feature, please open up a Pull Request on your fork
with your changes and a description of the approach you took. Also, as you work
through your feature, take note of any improvements you think could be made to
the service overall.

# Existing functionality

The following endpoints are currently implemented:

* `GET /movies`: Lists all movies.
* `POST /movies`: Creates a new movie.
* `GET /movies/<id>`: Gets an existing movie.
* `PUT /movies/<id>`: Updates an existing movie.

> See `swagger.yml` for a more detailed description of the API endpoints.

The central resource to this service is a `Movie` which has the following
schema:

```
{
    "id": "ae4a0145-2aa8-45e6-9816-e9a52e2498fc",
    "name": "The Girl with the Dragon Tattoo",
    "genres": [
        "Crime",
        "Drama",
        "Mystery",
        "Thriller"
    ],
    "director": "David Fincher",
    "content_rating": "R",
    "release_date": "2011-03-12T08:00:00Z",
    "duration": 158,
    "rating": 7.8,
    "budget": 90000000
}
```

# Installation

## Requirements

* git
* [Docker](https://docs.docker.com/install/)
* Nodejs 8 + npm

## Setup local development environment

```
# Install the development dependencies.
npm install
```

## Starting the Docker containers

The service uses [`docker-compose`](https://docs.docker.com/compose/overview/)
to manage the two required containers for running our service. The first
container is running our MongoDB instance and the second is running the node
code found under `src/` in this repository. To start both containers run the
following command:

```
docker-compose up --build
```

> Note: This command requires being able to bind to port `5000` for the API,
> and port `27017` for MongoDB. Running this command blocks the terminal so you
> may have to start a new terminal instance in order to run the following
> commands while keeping your services up. Pressing `ctrl-c` will exit out of
> this blocking process and stop your services.

To test that the service is running properly you can run:

```
curl http://localhost:5000/movies
```

This should respond with an empty list (`[]`) as no movies exist the MongoDB
data store by default.

## Load test data

We've included a set of over 5000 movies for testing. To load the movies into
MongoDB, run the following:

```
cd data
node load_movies.js
```

Now if you run `curl http://localhost:5000/movies` you should get a flood of
movie records back.

## Running your service locally

You can develop within your docker container if you like by making code changes
and then running `docker-compose up --build` after each change. However, it can
also be useful to run the service outside of a Docker container.

To run the service outside of Docker, do the following:

```
# Stop the API docker container.
docker-compose stop api

# Run the service locally.
npm start
```

## Testing

We use [mocha](https://mochajs.org/) for our unit testing. To
execute the test suite run:

```
npm test
```

## Linting

For code style we enforce [eslint](https://eslint.org/)
compliance. To lint your code run:

```
npm run lint
```

## Documentation generation

```
npm run docs
```
