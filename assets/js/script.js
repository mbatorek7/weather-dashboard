//GLOBAL ELEMENT VARIABLES
var inputEL = document.getElementById("cityName");
var searchBtnEL = document.getElementById("searchBTN");
var cardContEL = document.getElementById("cardContainer");
var forecastContEL = document.getElementById("forecastContainer");
var btnContEL = document.getElementById("buttonHolder");
var city_name = "";

// assign API to a variable
const APIKey = '7423690088d431deeb7881c189cccd22';
//history array
var searchHistory = [];
var weatherData;

getPastCity();

function findCity(city) {
    city_name = city;
    //add city name to search history
    searchHistory.push(city);
    //create link to weather API to obtain data
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
    .then(response=>response.json())
    .then(data=>{
        //create another link to weather API that gives more information
        var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely&appid=${APIKey}&units=imperial`;
        fetch(forecastURL)
        .then(response=>response.json())
        .then(data=> {
            //clear both containers in case old information is presented first
            clearcontent("cardContainer");
            clearcontent("forecastContainer")
            //generate the div for all the current weather info
            var weatherCard = generateWeatherCard(data);
            //add div to the container
            cardContEL.append(weatherCard);
            //create individual divs for the upcoming weather info
            generateForecast(data);
            console.log(data)
            localStorage.setItem("weather", JSON.stringify(data))
        })
    })
    //save search history to local storage
    //saveSearch();
}

//clear container for next search
function clearcontent(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function createButtons() {
    var pastSearch = JSON.parse(localStorage.getItem("searchHistory"))||[];
    btnContEL.innerHTML = "";
    for(var i = 0; i < pastSearch.length; i++) {
        var btn = document.createElement("button");
        btn.textContent = pastSearch[i];
        btn.classList.add("pastCityBtn");
        btn.onclick = function(event){
            findCity(event.target.textContent)
        }
        btnContEL.append(btn);
        // document.querySelector(".pastCityBtn").addEventListener("click", function(event){
        //     findCity(event.target.textContent)
        // })
    }
}

//save past searches
var saveSearch = function(){
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
};

// Were calling above to get past weather data once app has started
function getPastCity() {
    weatherData = JSON.parse(localStorage.getItem("weather"));
}

function generateForecast(weather) {
    //create for loop that will generate all 5 divs for the 5-day forecast
    for(var i = 1; i < 6; i++) {
        var cardDiv = document.createElement("div");
        cardDiv.classList.add("grid-child-element");
        cardDiv.setAttribute("style", "background-color: lightblue;");

        var iconCode = weather.current.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
        var icon = document.createElement("img");
        icon.setAttribute("src", iconURL);

        //create header that displays the upcoming date
        var cardHeader = document.createElement("h5");
        cardHeader.setAttribute("style", "text-align: center;")
        cardHeader.innerText = dayjs.unix(weather.daily[i].dt).format('MMM D, YYYY'); 

        //create a paragraph with temp and humidity on new lines
        var cardPara = document.createElement("pre");
        const node1 = document.createTextNode("Temperature: " + weather.daily[i].temp.day + "°F" 
        + "\nHumidity: " + weather.daily[i].humidity + "%");
        //add text to the paragraph element
        cardPara.appendChild(node1);

        //add text to the paragraph element
        cardDiv.appendChild(icon);
        cardDiv.appendChild(cardHeader);
        cardDiv.appendChild(cardPara);

        //add div to forecast container
        forecastContEL.append(cardDiv);
    }
}

function generateWeatherCard(weatherInfo) {
    ///create div for current weather
    var cardDiv = document.createElement("div");

    //create header that capitalizes the search input and displays today's date
    var cardHeader = document.createElement("h1");
    var today = dayjs().format('MMM D, YYYY');
    cardHeader.innerText = city_name + " " + today;

    var iconCode = weatherInfo.current.weather[0].icon;
    var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
    var icon = document.createElement("img");
    icon.setAttribute("src", iconURL);

    //create a paragraph with temp, humidity, and wind speed on new lines
    var cardPara = document.createElement("pre");
    const node1 = document.createTextNode("Temperature: " + weatherInfo.current.temp + "°F" 
    + "\nHumidity: " + weatherInfo.current.humidity + "%"
    + "\nWind Speed: " + weatherInfo.current.wind_speed + " MPH");
    //add text to the paragraph element
    cardPara.appendChild(node1);

    //add text to the paragraph element
    cardDiv.appendChild(icon);
    cardDiv.appendChild(cardHeader);
    cardDiv.appendChild(cardPara);

    //display the div
    return cardDiv;
}

//find city when search button is pressed
$("#searchBTN").click(function() {
    findCity(inputEL.value);
    saveSearch();
    createButtons();
})