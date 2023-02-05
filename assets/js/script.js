//GLOBAL ELEMENT VARIABLES
var inputEL = document.getElementById("cityName");
var searchBtnEL = document.getElementById("searchBTN");
var cardContEL = document.getElementById("cardContainer");

// assign API to a variable
const APIKey = '9cfe7036b90b3a13af1a88f6bf534b32';
//history array
var searchHistory = [];
var weatherData;

function findCity(city) {
    searchHistory.push(city);
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
    .then(response=>response.json())
    .then(data=>{
        var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely&appid=${APIKey}&units=imperial`;
        fetch(forecastURL)
        .then(response=>response.json())
        .then(data=>localStorage.setItem("weather", JSON.stringify(data)))
    })
    weatherData = JSON.parse(localStorage.getItem("weather"));
    console.log(weatherData);
    var weatherCard = generateWeatherCard(weatherData);
    cardContEL.append(weatherCard);
}

function generateWeatherCard(weatherInfo) {
    var cardHeader = document.createElement("h1");
    cardHeader.innerText = weatherInfo.current.temp;
    return cardHeader;
}

$("#searchBTN").click(function() {
    return findCity(inputEL.value);
})