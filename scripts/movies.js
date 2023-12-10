// List of example movie titles to display
const movieTitles = [
    'The Shawshank Redemption',
    'The Godfather',
    'The Dark Knight',
    'The Godfather: Part II',
    '12 Angry Men',
    'Schindler\'s List',
    'The Lord of the Rings: The Return of the King',
    'Pulp Fiction',
    'The Good, the Bad and the Ugly',
    'The Lord of the Rings: The Fellowship of the Ring'
];

// Function to fetch movie details from the OMDB API
function fetchMovieDetails(movieTitle) {
    const apiKey = '3f20b27d'; 
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovie(data);
        })
        .catch(error => {
            console.error('Error fetching details:', error);
        });
}

// Function to display movie details on the page
function displayMovie(movieData) {
    const moviesContainer = document.getElementById('movies-container');

    const movieElement = document.createElement('div');
    movieElement.className = 'movie-card';
    movieElement.innerHTML = `
        <img src="${movieData.Poster}" alt="${movieData.Title}">
        <div class="movie-info">
            <h3>${movieData.Title}</h3>
            <p>${movieData.Plot}</p>
            <p><strong>Rating:</strong> ${movieData.imdbRating}</p>
            <button>Add to Watchlist</button>
            <button>Trailer</button>
        </div>
    `;
    moviesContainer.appendChild(movieElement);
}

// Initial function to fetch and display a list of movies
function showMoviesList() {
    movieTitles.forEach(title => {
        fetchMovieDetails(title);
    });
}

// Call this function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', showMoviesList);
