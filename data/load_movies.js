const fs = require('fs-extra');
const request = require('request-promise-native');

(async function() {
    const movies = await fs.readJSON('movies.json');
    for (const index in movies) {
        const movie = movies[index];
        // eslint-disable-next-line no-console
        console.log(`Loading ${movie.name} (${index + 1}/${movies.length})`);
        await request({
            method: 'POST',
            uri: 'http://localhost:5000/movies',
            json: true,
            body: movie
        });
    }
})();
