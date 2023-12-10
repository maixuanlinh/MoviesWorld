document.addEventListener('DOMContentLoaded', function() {
    fetchTheaterAreas();
});

function fetchTheaterAreas() {
    const areasUrl = 'http://www.finnkino.fi/xml/TheatreAreas/';
    fetch(areasUrl)
        .then(response => response.text()) // Parse the XML text response
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            const theaters = data.querySelectorAll('TheatreArea');
            displayTheaters(theaters);
        })
        .catch(error => {
            console.error('Error fetching theater areas:', error);
        });
}

function displayTheaters(theaters) {
    const theatersContainer = document.getElementById('theaters-container');
    
    theaters.forEach(theater => {
        const id = theater.getElementsByTagName('ID')[0].textContent;
        const name = theater.getElementsByTagName('Name')[0].textContent;
        
        const theaterElement = document.createElement('div');
        theaterElement.className = 'theater-card';
        theaterElement.innerHTML = `
            <div class="theater-info">
                <h2>${name}</h2>
                <button onclick="selectTheater('${id}')">See Showtimes</button>
            </div>
        `;

        theatersContainer.appendChild(theaterElement);
    });
}

function selectTheater(theaterId) {

    //redirecting to the movies page with the selected theaterId as a parameter
    window.location.href = 'movies.html?theater=' + theaterId;
}
