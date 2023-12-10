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

const theaterImageMapping = {
    'Pääkaupunkiseutu': 'KinopalatsiHki_1920.jpg', 
    'Espoo': 'Omena_1920.jpg', 
    'Espoo: OMENA': 'Omena_1920.jpg',
    'Espoo: SELLO': 'Sello_1920.jpg',
    'Helsinki': 'KinopalatsiHki_1920.jpg',
    'Helsinki: ITIS': 'Itis_1920x800.jpg',
    'Helsinki: KINOPALATSI': 'KinopalatsiHki_1920.jpg',
    'Helsinki: MAXIM': 'Maxim_1920a.jpg',
    'Helsinki: TENNISPALATSI': 'Tennispalatsi_1920u.jpg', 
    'Vantaa: FLAMINGO': 'Flamingo_1920b.jpg',
    'Jyväskylä: FANTASIA': 'Fantasia_1920uu.jpg', 
    'Kuopio: SCALA': 'Scala_1920a.jpg',
    'Lahti: KUVAPALATSI': 'Kuvapalatsi_1920.jpg',
    'Lappeenranta: STRAND': 'Strand_1920.jpg',
    'Oulu: PLAZA': 'Plaza_1920a.jpg',
    'Pori: PROMENADI': 'Pori2018_1920.jpg', 
    'Tampere': 'Plevna_1920.jpg',
    'Tampere: CINE ATLAS': 'Tre_CineAtlas_2019_1920.jpg', 
    'Tampere: PLEVNA': 'Plevna_1920.jpg',
    'Turku ja Raisio': 'mylly_luxe_entrance.jpg', 
    'Turku: KINOPALATSI': 'KinopalatsiTurkuB_1920.jpg',
    'Raisio: LUXE MYLLY': 'mylly_luxe_entrance.jpg' 
};



function displayTheaters(theaters) {
    const theatersContainer = document.getElementById('theaters-container');
    
    theaters.forEach(theater => {
        const id = theater.getElementsByTagName('ID')[0].textContent;
        const name = theater.getElementsByTagName('Name')[0].textContent;

        // Map the theater name to the corresponding image filename
        const imageName = theaterImageMapping[name] || 'default_image.jpg'; // Fallback to a default image if no match is found

        const theaterElement = document.createElement('div');
        theaterElement.className = 'theater-card';
        theaterElement.innerHTML = `
            <img src="assets/${imageName}" alt="${name}" class="theater-image">
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
