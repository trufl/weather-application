const $todaysWeatherDisplay = document.querySelector('#todays-weather')
const $prevSearchDisplay = document.querySelector('#prev-search');
const $citySearchForm = document.querySelector('#city-search');
let prevSearches = [];
let city;


function init() {

    if(localStorage.getItem('prevSearchesArr') !== null) {
        prevSearches = localStorage.getItem('prevSearchesArr');

        displaySearches();
    }

}



function displaySearches() {

    for(let i = 0; i < prevSearches.length; i++) {
        const $searchItem = document.createElement('li');

        $searchItem.textContent = prevSearches[i];

        $prevSearchDisplay.append($searchItem)
    }

}

function refreshSearchDisplay() {

    while ($prevSearchDisplay.firstChild) {
        $prevSearchDisplay.removeChild($prevSearchDisplay.firstChild);
    }

}

function handleFormSubmit(event) {
    event.preventDefault();

    const $cityInput = document.querySelector('#city-input');

    city = $cityInput.value;

    if(!prevSearches.includes(city) && city !== "") {
        prevSearches.push(city);

        localStorage.setItem('prevSearchArr', prevSearches);

        getCityWeather();
        refreshSearchDisplay();
        displaySearches();
    } else if (prevSearches.includes(city)) {
        console.log("Already Searched");
    } else if (city === "") {
        console.log("Please Enter a City");
    }
}

$citySearchForm.addEventListener('submit', handleFormSubmit);