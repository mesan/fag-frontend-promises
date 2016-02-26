(() => {

    // Utility method for calculating mean value of an array of numbers.
    function mean(numbers) {
        return numbers.reduce((sum, number) => sum + number, 0) / numbers.length;
    }

    // Solved with callback hell.
    
    superagent.get('./data/1.json', (err, response1) => {
        superagent.get('./data/2.json', (err, response2) => {
            superagent.get('./data/3.json', (err, response3) => {
                superagent.get('./data/4.json', (err, response4) => {
                    var ratings = [response1, response2, response3, response4]
                        .map(response => response.body.rating);
                    console.log(mean(ratings));
                });
            });
        });
    });

    // Solved neatly with promises.

    var requests = [1, 2, 3, 4]
        .map(nr => `./data/${nr}.json`)
        .map(file => fetch(file));

    Promise.all(requests)
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(jsonMovies => {
            var ratings = jsonMovies.map(jsonMovie => jsonMovie.rating);
            console.log(mean(ratings));
        });

})();