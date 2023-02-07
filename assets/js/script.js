//GLOBAL ELEMENT VARIABLES
var inputEL = document.getElementById("cityName");
var searchBtnEL = document.getElementById("searchBTN");
var cardContEL = document.getElementById("cardContainer");

// assign API to a variable
const APIKey = '7423690088d431deeb7881c189cccd22';
//history array
var searchHistory = [];
var weatherData;

getPastCity();

function findCity(city) {
    searchHistory.push(city);
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
    .then(response=>response.json())
    .then(data=>{
        var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely&appid=${APIKey}&units=imperial`;
        fetch(forecastURL)
        .then(response=>response.json())
        .then(data=> {
            clearcontent("cardContainer");
            var weatherCard = generateWeatherCard(data);
            cardContEL.append(weatherCard);
            generateForecast(data);
            console.log(data)
            localStorage.setItem("weather", JSON.stringify(data))
        })
    })
}

//clear container for next search
function clearcontent(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

// Were calling above to get past weather data once app has started
function getPastCity() {
    weatherData = JSON.parse(localStorage.getItem("weather"));
}

function generateForecast(weather) {
    for(var i = 1; i < 6; i++) {
        var cardDiv = document.createElement("div");
        cardDiv.classList.add("col-md-6");
        var cardHeader = document.createElement("h5");
        cardHeader.innerText = dayjs.unix(weather.daily[i].dt).format('MMM D, YYYY'); 
        var cardPara = document.createElement("pre");
        const node1 = document.createTextNode("Temperature: " + weather.daily[i].temp.day + "°F" 
        + "\nHumidity: " + weather.daily[i].humidity + "%");

        cardPara.appendChild(node1);

        cardDiv.appendChild(cardHeader);
        cardDiv.appendChild(cardPara);
        cardContEL.append(cardDiv);
    }
}

function generateWeatherCard(weatherInfo) {
    var cardDiv = document.createElement("div");
    var cardHeader = document.createElement("h1");
    var today = dayjs().format('MMM D, YYYY');
    cardHeader.innerText = inputEL.value + " " + today;
    var cardPara = document.createElement("pre");
    const node1 = document.createTextNode("Temperature: " + weatherInfo.current.temp + "°F" 
    + "\nHumidity: " + weatherInfo.current.humidity + "%"
    + "\nWind Speed: " + weatherInfo.current.wind_speed + " MPH");

    cardPara.appendChild(node1);

    cardDiv.appendChild(cardHeader);
    cardDiv.appendChild(cardPara);

    return cardDiv;
}

$("#searchBTN").click(function() {
    return findCity(inputEL.value);
})