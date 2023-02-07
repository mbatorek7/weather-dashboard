//GLOBAL ELEMENT VARIABLES
var inputEL = document.getElementById("cityName");
var searchBtnEL = document.getElementById("searchBTN");
var cardContEL = document.getElementById("cardContainer");

// assign API to a variable
const APIKey = '0396888a07439c5f30eb317dbdc6b0f4';
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
            console.log(data)
            cardContEL.append(weatherCard);
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