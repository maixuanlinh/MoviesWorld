
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const theaterId = params.get('theater');
    const theaterName = params.get('theaterName'); 
    if (theaterId, theaterName) {
        fetchMoviesForTheater(theaterId, theaterName);
    }
});

// Set to keep track of titles already fetched
const fetchedTitles = new Set();

function fetchMoviesForTheater(theaterId, theaterName) {
    // Fetch the theater name and set it to the #theater-showing-text element
    const theaterAreasUrl = `https://www.finnkino.fi/xml/TheatreAreas/`;
    fetch(theaterAreasUrl)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
           
            const theaterNameSpan = document.createElement('span');
            theaterNameSpan.textContent = theaterName;
            theaterNameSpan.classList.add('theater-name-style'); // Add a class for styling
            
            // Clear the existing text content before appending new content
            document.getElementById('theater-showing-text').textContent = 'Currently showing at:  ';
            document.getElementById('theater-showing-text').appendChild(theaterNameSpan);
                    })
        .catch(error => {
            console.error('Error fetching theater name:', error);
        });

    // Continue with fetching the movies
    const scheduleUrl = `https://www.finnkino.fi/xml/Schedule/?area=${theaterId}&dt=${getDate()}`;
    fetch(scheduleUrl)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const shows = data.querySelectorAll("Show");
            shows.forEach(show => {
                const title = show.querySelector("Title").textContent;
                if (!fetchedTitles.has(title)) {
                    fetchedTitles.add(title);
                    fetchMovieDetails(title);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching schedule:', error);
        });
}

function getDate() {
    const date = new Date();
    return date.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
}




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
    // Check if the movie data is valid before creating the card
    if (!movieData || movieData.Response === "False") {
        console.log(`Movie data not found for: ${movieData.Title}`);
        return; // Exit the function if movie data is not valid
    }

    const moviesContainer = document.getElementById('movies-container');
    const movieElement = document.createElement('div');
    movieElement.className = 'movie-card';
    movieElement.innerHTML = `
        <img src="${movieData.Poster !== "N/A" ? movieData.Poster : 'path/to/default/image.jpg'}" alt="${movieData.Title}">
        <div class="movie-info">
            <h3 class="movie-title">${movieData.Title}</h3>
            <p class="movie-plot">${movieData.Plot}</p>
            <p><strong>Rating:</strong> ${movieData.imdbRating}</p>
            <p><strong>Duration:</strong> ${movieData.Runtime}</p>
            <p><strong>Released:</strong> ${movieData.Released}</p>
            <div class="ticket-btn-container">   <button class="movie-tickets-btn" onClick="alert('This feature is being updated. Please check back later');">Buy tickets</button>   </div>
            

            
          
    
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


document.getElementById('search-bar').addEventListener('input', filterMovies);

function filterMovies() {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const movieCards = document.querySelectorAll('.movie-card');
    const movieSearchResultInfo = document.getElementById('movie-search-result-info');
    
    let visibleMoviesCount = 0;
    
    movieCards.forEach(card => {
        const title = card.querySelector('.movie-title').textContent.toLowerCase();
        if (title.includes(searchQuery)) {
            card.style.display = ''; // Show the movie card
            visibleMoviesCount++;
        } else {
            card.style.display = 'none'; // Hide the movie card
        }
    });
    
    // Update the search result info text
    movieSearchResultInfo.textContent = `Found ${visibleMoviesCount} movies.`;
}
