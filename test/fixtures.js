const sinon = require('sinon');

const MOVIES = require('../data/movies.json');

const spies = [];

class MockMovie {
    async save() {}

    static async find() {}

    static async findById() {}

    static reset() {
        for (const spy of spies) {
            spy.resetHistory();
        }
    }
}

spies.push(sinon.stub(MockMovie, 'find').resolves(MOVIES));
spies.push(sinon.stub(MockMovie, 'findById').resolves(MOVIES[0]));
spies.push(sinon.stub(MockMovie.prototype, 'save').resolves());

module.exports = {
    MockMovie,
    MOVIES,
};
