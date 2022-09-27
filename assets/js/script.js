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

function getCityWeather(city) {

    const weatherLink = "https://api.openweathermap.org/data/2.5/forecast?q=";
    const apiKey = "0d7724b53ab6199eface06b3174e7688";

    const requestUrl = `${weatherLink}${city}&appid=${apiKey}&cnt=6&units=imperial`

    fetch(requestUrl)
    .then(function (response) {
      if (response.ok) {

        response.json()

        .then(function (data) {

          console.log(data);

        });

      } else {

        alert('Error: ' + response.statusText);

      }
    })
    .catch(function (error) {

      alert('Unable to connect to weather');
      
    });

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

    city = $cityInput.value.trim();
    city = city.toLowerCase();

    if(!prevSearches.includes(city) && city !== "") {

        prevSearches.push(city);

        localStorage.setItem('prevSearchArr', prevSearches);

        getCityWeather(city);
        refreshSearchDisplay();
        displaySearches();

    } else if (prevSearches.includes(city)) {

        getCityWeather(city);

    } else if (city === "") {
        console.log("Please Enter a City");
    }
}

$citySearchForm.addEventListener('submit', handleFormSubmit);