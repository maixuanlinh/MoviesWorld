// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Fetch information about theater areas upon initial page load
  fetchTheaterAreas();
});

// Function to fetch theater areas from the Finnkino API
function fetchTheaterAreas() {
  // Finnkino API endpoint for theater areas
  const areasUrl = "https://www.finnkino.fi/xml/TheatreAreas/";
  // Fetch the data from the API
  fetch(areasUrl)
    .then((response) => response.text()) // Convert the response to text format
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml")) // Parse the text as XML
    .then((data) => {
      // Extract theater areas from the XML data
      const theaters = data.querySelectorAll("TheatreArea");
      // Display each theater on the page
      displayTheaters(theaters);
    })
    .catch((error) => {
      // Log any errors to the console
      console.error("Error fetching theater areas:", error);
    });
}

// Mapping of theater names to their respective image filenames (I add this extra part to show the images of the theaters, because the API doesn't provide the images of the theaters)
// These images are stored in the assets folder and mapped to the theater names, making the UI more visually appealing.
const theaterImageMapping = {
  "Pääkaupunkiseutu": "KinopalatsiHki_1920.jpg",
  "Espoo": "Omena_1920.jpg",
  "Espoo: OMENA": "Omena_1920.jpg",
  "Espoo: SELLO": "Sello_1920.jpg",
  "Helsinki": "KinopalatsiHki_1920.jpg",
  "Helsinki: ITIS": "Itis_1920x800.jpg",
  "Helsinki: KINOPALATSI": "KinopalatsiHki_1920.jpg",
  "Helsinki: MAXIM": "Maxim_1920a.jpg",
  "Helsinki: TENNISPALATSI": "Tennispalatsi_1920u.jpg",
  "Vantaa: FLAMINGO": "Flamingo_1920b.jpg",
  "Jyväskylä: FANTASIA": "Fantasia_1920uu.jpg",
  "Kuopio: SCALA": "Scala_1920a.jpg",
  "Lahti: KUVAPALATSI": "Kuvapalatsi_1920.jpg",
  "Lappeenranta: STRAND": "Strand_1920.jpg",
  "Oulu: PLAZA": "Plaza_1920a.jpg",
  "Pori: PROMENADI": "Pori2018_1920.jpg",
  "Tampere": "Plevna_1920.jpg",
  "Tampere: CINE ATLAS": "Tre_CineAtlas_2019_1920.jpg",
  "Tampere: PLEVNA": "Plevna_1920.jpg",
  "Turku ja Raisio": "mylly_luxe_entrance.jpg",
  "Turku: KINOPALATSI": "KinopalatsiTurkuB_1920.jpg",
  "Raisio: LUXE MYLLY": "mylly_luxe_entrance.jpg",
};

// Function to display theater information on the page
function displayTheaters(theaters) {
  // Get the container element where theaters will be displayed
  const theatersContainer = document.getElementById("theaters-container");

  // Iterate over each theater from the fetched data
  theaters.forEach((theater) => {
    // Extract the ID and name from the theater data
    const id = theater.getElementsByTagName("ID")[0].textContent;
    const name = theater.getElementsByTagName("Name")[0].textContent;

    // Find the corresponding image for the theater or use a default (Finnkino image) if not found
    const imageName = theaterImageMapping[name] || "default_image.jpg";

    // Create a new card element for the theater
    const theaterElement = document.createElement("div");
    theaterElement.className = "theater-card";
    theaterElement.innerHTML = `
            <img src="assets/${imageName}" alt="${name}" class="theater-image">
            <div class="theater-info">
                <h2>${name}</h2>              
            </div>
            <div class="theater-button-div">
            <button class="current-movies-btn" onclick="selectTheater('${id}', '${name}')">
            <img src="assets/icons/film-strip.png" alt="Film Strip" class="film-strip-icon">
            Current Movies</button>
            </div>
        `;

    // Add the new theater card to the page
    theatersContainer.appendChild(theaterElement);
  });
}

// Function to handle theater selection, redirecting to the movie listing page
function selectTheater(theaterId, theaterName) {
    // Ensure the theater name is URL-encoded to prevent URL issues
    const encodedTheaterName = encodeURIComponent(theaterName);
    
    // Redirect to the movies page with theater ID and name in the query parameters
    window.location.href = `movies.html?theater=${theaterId}&theaterName=${encodedTheaterName}`;
}

// SEARCH FUNCTION: Function to filter theaters based on user input in the search bar
function filterTheaters() {
    // Retrieve the user's search query and convert it to lowercase
    const searchQuery = document.getElementById('theater-search-bar').value.toLowerCase();
    // Select all theater cards on the page
    const theaterCards = document.querySelectorAll('.theater-card');
    // Get the element where search results info will be displayed
    const searchResultInfo = document.getElementById('search-result-info');

    // Initialize a counter for the number of visible theaters
    let visibleTheatersCount = 0;

    // Loop through each theater card
    theaterCards.forEach(card => {
        // Get the theater name and convert it to lowercase
        const theaterName = card.querySelector('.theater-info h2').textContent.toLowerCase();
        // Check if the theater name includes the search query
        if (theaterName.includes(searchQuery)) {
            card.style.display = ''; // Show the card if it matches the search
            visibleTheatersCount++; // Increment the visible theater count
        } else {
            card.style.display = 'none'; // Hide the card if it does not match
        }
    });

    // Update the search result info text with the number of theaters found
    if (searchResultInfo) {
        searchResultInfo.textContent = `${visibleTheatersCount} theaters found.`;
    } else {
        // If the search result info element does not exist, create it and add it to the page
        const infoText = document.createElement('h2');
        infoText.id = 'search-result-info';
        infoText.textContent = `${visibleTheatersCount} theaters found.`;
        document.getElementById('theater-search-container').appendChild(infoText);
    }
}

// Add an event listener to the search bar for the input event to trigger the theater filter function
document.getElementById('theater-search-bar').addEventListener('input', filterTheaters);

