const $todaysWeather = document.querySelector('#todays-weather')
const $todaysConditions = document.querySelector('#todays-conditions');
const $forecastDisplay = document.querySelector('#forecast');
const $prevSearchDisplay = document.querySelector('#prev-search');
const $citySearchForm = document.querySelector('#city-search');
let prevSearches = [];

function init() {

    if(localStorage.getItem('prevSearchesArr') !== null) {

        prevSearches = JSON.parse(localStorage.getItem("prevSearchesArr"));

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
            refreshWeatherDisplay();
            displayWeather(weatherData);
            displayForecast(weatherData);

        });

        if (!prevSearches.includes(city)) {

            prevSearches.push(city);

            localStorage.setItem("prevSearchesArr", JSON.stringify(prevSearches));

        }

        refreshSearchDisplay();
        displaySearches();

      } else {

        alert('Please enter a valid city');

      }
    })
    .catch(function (error) {

      alert('Unable to connect to weather');
      
    });

}

function displayWeather(weatherData) {

    const cityName = weatherData.city_name;
    const todaysDate = moment(weatherData.data[0].valid_date).format("(MM/DD/YYYY)");
    const todaysSymbol = getEmoji(weatherData.data[0].weather.code);
    const todaysTemp = `Temp: ${weatherData.data[0].temp}\xB0F`;
    const todaysWind = `Wind: ${weatherData.data[0].wind_spd} MPH`;
    const todaysHumidity = `Humidity: ${weatherData.data[0].rh}%`;
    const todaysUv = `UV Index: <span class="${getUVColor(weatherData.data[0].uv)}">${weatherData.data[0].uv}</span>`;
    const conditionsArray = [todaysTemp,todaysWind,todaysHumidity,todaysUv];

    $todaysWeather.textContent = `${cityName} ${todaysDate} ${todaysSymbol}`;

    for (let i = 0; i < conditionsArray.length; i++) {

        const $conditionItem = document.createElement('p');

        if(i < 3) {

            $conditionItem.textContent = conditionsArray[i];

        } else {

            $conditionItem.innerHTML = conditionsArray[i];

        }

        $todaysConditions.append($conditionItem);

    }

}

function displayForecast(weatherData) {

    for(let i = 1; i < weatherData.data.length; i++) {

        const date = moment(weatherData.data[i].valid_date).format("(MM/DD/YYYY)");
        const symbol = getEmoji(weatherData.data[i].weather.code);
        const temp = `Temp: ${weatherData.data[i].temp}\xB0F`;
        const wind = `Wind: ${weatherData.data[i].wind_spd} MPH`;
        const humidity = `Humidity: ${weatherData.data[i].rh}%`;
        const conditionsArray = [symbol,temp,wind,humidity];
        const $forecastSection = document.createElement('section');
        const $forecastDate = document.createElement('h4');

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
        $searchItem.setAttribute("data-city",`${prevSearches[i]}`);

        $prevSearchDisplay.append($searchItem)

    }

}

function refreshWeatherDisplay() {

    $todaysWeather.textContent = "";

    while($todaysConditions.firstChild) {

        $todaysConditions.removeChild($todaysConditions.firstChild);

    }

    while($forecastDisplay.firstChild) {

        $forecastDisplay.removeChild($forecastDisplay.firstChild);

    }

}

function refreshSearchDisplay() {

    while ($prevSearchDisplay.firstChild) {

        $prevSearchDisplay.removeChild($prevSearchDisplay.firstChild);

    }

}

function getUVColor(uvIndexNum) {

    if(uvIndexNum < 3) {
        return "low-index";
    } else if(uvIndexNum < 6) {
        return "moderate-index";
    } else if(uvIndexNum < 8) {
        return "high-index";
    } else if(uvIndexNum < 11) {
        return "v-high-index";
    } else {
        return "extreme-index";
    }
}

function getEmoji(emojiCode) {

    switch(emojiCode) {
        case 200:
        case 201:
        case 202:
            return "🌦";
        case 230:
        case 231:
        case 232:
        case 233:
            return "🌩";
        case 300:
        case 301:
        case 302:
        case 500:
        case 501:
        case 502:
        case 511:
        case 520:
        case 521:
        case 522:
            return "🌧";
        case 600:
        case 601:
        case 602:
        case 610:
        case 611:
        case 612:
        case 621:
        case 622:
        case 623:
            return "🌨";
        case 700:
        case 711:
        case 721:
        case 731:
        case 741:
        case 751:
            return "🌥";
        case 800:
            return "☀️";
        case 801:
        case 802:
        case 803:
            return "🌤";
        case 804:
            return "☁️";
        default:
            return "⛈";
    }


}

function handleFormSubmit(event) {
    event.preventDefault();

    const $cityInput = document.querySelector('#city-input');
    let city = $cityInput.value.trim();
    city = city.toLowerCase();

    if(city !== "") {

        getCityWeather(city);
        $cityInput.value = "";

    } else if (city === "") {

        console.log("Please Enter a City");

    }
}

function handleClickEvent(event) {
    event.stopPropagation();

    const city = event.target.getAttribute("data-city");

    getCityWeather(city);

}

init();
$citySearchForm.addEventListener('submit', handleFormSubmit);
$prevSearchDisplay.addEventListener('click', handleClickEvent);