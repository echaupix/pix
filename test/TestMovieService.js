const chai = require('chai');
const { createRequest, createResponse } = require('node-mocks-http');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

// configure chai
chai.use(sinonChai);
const { expect } = chai;

// grab our mocks and testing data from fixtures.
const { MOVIES, MockMovie } = require('./fixtures');

// Use proxyquire to inject our MovieMock.
const MovieService = proxyquire('../src/MovieService', {
    './models/Movie': MockMovie
});

describe('MovieService', () => {
    let service;

    beforeEach(() => {
        // create a new instance of the movie service.
        service = new MovieService(5000, 'localhost', 'test');

        // set the MockMovie functions to ensure we have a clean
        // mock for each test run.
        MockMovie.reset();
    });

    describe('getAllMovies()', () => {
        it('returns all movies in the database', async () => {
            const req = createRequest();
            const res = createResponse();
            await service.getAllMovies(req, res);

            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.equal(MOVIES);
        });

        it('returns a 500 if an error occurs while fetching', async () => {
            const req = createRequest();
            const res = createResponse();

            // force find() to fail.
            const message = 'Find failed.';
            MockMovie.find.rejects({ message });

            await service.getAllMovies(req, res);
            expect(res.statusCode).to.equal(500);
            expect(res._getData()).to.deep.equal({ message });
        });
    });

    describe('createMovie()', () => {
        it('should return a 201 when successful', async() => {
            const req = createRequest({ body: MOVIES[0] });
            const res = createResponse();

            const model = new MockMovie();
            sinon.stub(service, '_createMovieModel')
                .returns(model);

            await service.createMovie(req, res);

            expect(res.statusCode).to.equal(201);
            expect(model.save).to.be.calledOnce;
            expect(service._createMovieModel).to.be.calledOnceWith(MOVIES[0]);
        });

        it('should return a 500 when save fails', async() => {
            const req = createRequest({ body: MOVIES[0] });
            const res = createResponse();

            const model = new MockMovie();
            sinon.stub(service, '_createMovieModel')
                .returns(model);

            model.save.rejects();

            await service.createMovie(req, res);

            expect(res.statusCode).to.equal(500);
            expect(model.save).to.be.calledOnce;
        });

    });

    describe('getMovieById()', () => {
        it('returns a movie and a 200', async () => {
            const { id } = MOVIES[0];
            const req = createRequest({ params: { id } });
            const res = createResponse();

            await service.getMovieById(req, res);
            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.deep.equal(MOVIES[0]);
        });

        it('sends a 404 if movie cannot be found', async () => {
            MockMovie.findById.resolves(null);

            const id = '5b77c958-d6ba-4a19-8e16-9f99baf2ee81';
            const req = createRequest({ params: { id } });
            const res = createResponse();

            await service.getMovieById(req, res);
            expect(res.statusCode).to.equal(404);
        });

        it('sends a 500 if an error occurs while fetching', async () => {
            const message = '';
            MockMovie.findById.rejects({ message });

            const id = '5b77c958-d6ba-4a19-8e16-9f99baf2ee81';
            const req = createRequest({ params: { id } });
            const res = createResponse();

            await service.getMovieById(req, res);
            expect(res.statusCode).to.equal(500);
            expect(res._getData()).to.deep.equal({ message });
        });
    });
});
