const $todaysWeather = document.querySelector('#todays-weather')
const $todaysConditions = document.querySelector('#todays-conditions');
const $forecastDisplay = document.querySelector('#forecast');
const $prevSearchDisplay = document.querySelector('#prev-search');
const $citySearchForm = document.querySelector('#city-search');
let prevSearches = [];

function init() {

    if(localStorage.getItem('prevSearchesArr') !== null) {
        prevSearches = localStorage.getItem('prevSearchesArr');

        displaySearches();
    }

}

function getCityWeather(city) {

    const weatherLink = "https://api.weatherbit.io/v2.0/forecast/daily?city=";
    const apiKey = "47a5f13b361942e680fd8c4ceca2bdfc";
    let weatherData;

    const requestUrl = `${weatherLink}${city}&key=${apiKey}&units=I&days=6`

    fetch(requestUrl)
    .then(function (response) {

      if (response.ok) {

        response.json()

        .then(function (data) {

            weatherData = data;
            console.log(weatherData);
            displayWeather(weatherData);
            displayForecast(weatherData);

        });

        if (!prevSearches.includes(city)) {

            prevSearches.push(city);

            localStorage.setItem('prevSearchArr', prevSearches);

        }

        refreshSearchDisplay();
        displaySearches();

      } else {

        alert('Error: ' + response.statusText);

      }
    })
    .catch(function (error) {

      alert('Unable to connect to weather');
      
    });

}

function displayWeather(weatherData) {

    const cityName = weatherData.city_name;
    const todaysDate = moment(weatherData.data[0].valid_date).format("(MM/DD/YYYY)");
    const todaysTemp = `Temp: ${weatherData.data[0].temp}\xB0F`;
    const todaysWind = `Wind: ${weatherData.data[0].wind_spd} MPH`;
    const todaysHumidity = `Humidity: ${weatherData.data[0].rh}%`;
    const todaysUv = `UV Index: ${weatherData.data[0].uv}`;
    const conditionsArray = [todaysTemp,todaysWind,todaysHumidity,todaysUv];
    //let todaysSymbol = `0x1${weatherData.data[i].weather.icon}`;

    $todaysWeather.textContent = `${cityName} ${todaysDate}`;

    for (let i = 0; i < conditionsArray.length; i++) {

        const $conditionItem = document.createElement('li');

        $conditionItem.textContent = conditionsArray[i];

        $todaysConditions.append($conditionItem);

    }

}

function displayForecast(weatherData) {

    for(let i = 1; i < weatherData.data.length; i++) {

        const date = moment(weatherData.data[i].valid_date).format("(MM/DD/YYYY)");
        const temp = `Temp: ${weatherData.data[i].temp}\xB0F`;
        const wind = `Wind: ${weatherData.data[i].wind_spd} MPH`;
        const humidity = `Humidity: ${weatherData.data[i].rh}%`;
        const conditionsArray = [temp,wind,humidity];
        const $forecastSection = document.createElement('section');
        const $forecastDate = document.createElement('h4');
        //let symbol = `0x1${weatherData.data[i].weather.icon}`;

        $forecastDate.textContent = date;
        $forecastSection.append($forecastDate)

        for (let x = 0; x < conditionsArray.length; x++) {

            const $conditionItem = document.createElement('p');

            $conditionItem.textContent = conditionsArray[x];

            $forecastSection.append($conditionItem);

        }

        $forecastDisplay.append($forecastSection);

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
    let city = $cityInput.value.trim();
    city = city.toLowerCase();

    if(city !== "") {

        getCityWeather(city);

    } else if (city === "") {

        console.log("Please Enter a City");

    }
}

$citySearchForm.addEventListener('submit', handleFormSubmit);