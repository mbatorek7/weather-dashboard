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

function findCity(city) {
    city_name = city;
    //add city name to search history
    //but check if it was already added first
    if(searchHistory.indexOf(city) == -1) {
        searchHistory.push(city);
    }
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
}

//clear container for next search
function clearcontent(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function createButtons() {
    //set past searches equal to previous search or empty if null
    var pastSearch = JSON.parse(localStorage.getItem("searchHistory"))||[];
    //clear btn container
    btnContEL.innerHTML = "";
    //create for loop that'll create a button for each unique search history name
    for(var i = 0; i < pastSearch.length; i++) {
        //create a btn element
        var btn = document.createElement("button");
        //set it equal to previous search
        btn.textContent = pastSearch[i];
        btn.classList.add("pastCityBtn");
        btn.classList.add("button-51");
        btn.setAttribute("id", "pastCityBtn");
        //when btn is clicked get the city name and find city
        btn.onclick = function(event){
            findCity(event.target.textContent)
        }
        //add this new btn to the container
        btnContEL.append(btn);
    }
}

//save past searches
var saveSearch = function(){
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function generateForecast(weather) {
    //create for loop that will generate all 5 divs for the 5-day forecast
    for(var i = 1; i < 6; i++) {
        var cardDiv = document.createElement("div");
        cardDiv.classList.add("grid-child-element");
        cardDiv.setAttribute("style", "background-color: lightblue;");

        //grab the icon code
        var iconCode = weather.daily[i].weather[0].icon;
        //grab the URL
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
        //create img for the icon
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
    cardHeader.innerText = city_name.toUpperCase() + " " + today;

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

function removeBtn() {
    //get first past city btn in search history array
    var elem = document.getElementById("pastCityBtn");
    //remove the btn
    elem.parentNode.removeChild(elem);
}

//find city when search button is pressed
$("#searchBTN").click(function() {
    findCity(inputEL.value);
    saveSearch();
    createButtons();
})

//find city when search button is pressed
$("#clearBtn").click(function() {
    localStorage.clear();
    removeBtn();
})