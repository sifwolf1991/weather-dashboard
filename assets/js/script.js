//VARIABLES grabbing HTML DOM elements/////////////////////////////////////////////

//
var API_KEY = 'ab76144ff688100c2b132206778aa386'

var searchInput = document.getElementById("search-input");
var searchHist = document.querySelector(".collection");
var searchHistory = JSON.parse(localStorage.getItem("last-search")) || [];



// FETCH REQUEST
// Function for searching for city weather for today
// gets the HTML elements for name, temperature, humidity and wind for today's weather
function search(searchTerm) {
    var WeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${API_KEY}&units=metric`
    
    fetch(WeatherURL)
    .then(function (response) {
            return response.json();
        })
        // puts city name into HTML name section
        // puts temperature into HTML temp section
        // puts humidity data into HTML humidity section
        // puts wind speed data into HTML wind section
        .then(function (currentData) {
            
            document.getElementById('name').innerHTML = currentData.name;
            document.getElementById('temp').innerHTML = Math.floor(currentData.main.temp);
            document.getElementById('hum').innerHTML = currentData.main.humidity;
            document.getElementById('wind').innerHTML = currentData.wind.speed;
            
////

            // gets weather icon and puts it into the current-icon HTML section
            // gets description of weather and puts it into the description HTML section
            var currentIcon = currentData.weather[0].icon;
            document.getElementById('current-icon').setAttribute("src", `http://openweathermap.org/img/wn/${currentIcon}@2x.png`);
            document.getElementById('description').innerHTML = currentData.weather[0].description;

//////////////////////////////////////////////////////////////////////////////////



// fetch request for the next 4 days forecasts
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${API_KEY}&units=metric`)
            .then(function (response) {
            return response.json();
            })
            .then(function (data) {
            var fiveDayList = data.list.filter(day => day.dt_txt.includes('12:00:00'));

// for loop: run through length of weather days for each data line of the html card: date, pic, temperature, humidity wind
                    for (var i = 0; i < fiveDayList.length; i++) {
                        // format date and put date onto the html card
                        var dateCard1 = new Date(fiveDayList[i].dt_txt).toLocaleString().split(',')[0];
                        document.getElementById(`date-card-${i}`).innerHTML = dateCard1;
                        var iconId = fiveDayList[i].weather[0].icon;
                        // put icon onto the card
                        document.getElementById(`img-card-${i}`).setAttribute("src", `http://openweathermap.org/img/wn/${iconId}@2x.png`);
                        // put temperature onto the card
                        document.getElementById(`temp-card-${i}`).innerHTML = Math.floor(fiveDayList[i].main.temp);
                        // put humidity onto the card
                        document.getElementById(`hum-card-${i}`).innerHTML = fiveDayList[i].main.humidity;

                        document.getElementById(`wind-card-${i}`).innerHTML = fiveDayList[i].wind.speed;
                    }
                })
// catches errors in grabbing the weather and creates an error message 
//to display where the city name would go
        }).catch(function () {
            document.getElementById('name').innerHTML = "Please enter a location.";
var img = document.getElementById("img-card");
img.onerror = function () {
    this.style.display = "none";
}
        });

// display current date above weather forecast on today's weather card
    var today = new Date();
    document.getElementById('current-date').innerHTML = today.toDateString();
}
//////////////////////////////////////////////////////////////////////////////////

// function to determine default display:
// if there is no previous search results in local storage, the default weather display will be
// for Toorak
// otherwise it will show the last search
function onLoad() {
    if (localStorage.getItem("last-search") === null) {
        var searchTerm = "toorak";
        search(searchTerm);
        localStorage.clear();
    } else {
        // searchTerm = localStorage.getItem("last-search");
        search(searchHistory[searchHistory.length - 1]);
        renderHistory();
    }
}

// load page
onLoad();

// Search History / Local Storage related //////////////////////////////////////////////////////////////

// function which creates DOM elements
// creates the previous search history list 
function renderHistory() {
    searchHist.innerHTML = '';
//creates a DOM HTML element  
    searchHistory.forEach(function (city) {
        // create DOM <a> element that holds the last search
        var searchHistoryEl = document.createElement("a");
        searchHistoryEl.setAttribute("href", "#!");
        // searchHistoryEl.id = "search-history-el-" + searchHistory.indexOf(searchHistory[i]);
        searchHistoryEl.className = "collection-item";
        searchHistoryEl.classList.add("search-hist-el")
        searchHistoryEl.innerHTML = city.toUpperCase();

// appends created DOM element object to History
        searchHist.appendChild(searchHistoryEl);
    });
}
//

// function to save search to local storage
// if statement: if the user has searched a city, JSON will convert it to string to save in local storage

function saveSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("last-search", JSON.stringify(searchHistory));
        console.log(searchHistory);
    }
}

// function to delete search history for delete search button
function deleteSearchHistory() {
    searchHist.innerHTML = "";
}

//////////////////////////////////////////////////////////////////////////////////

// event Handlers
// search button to start fetch requests
// prevents default refresh
//whitespaces in search input will be trimmed
document.getElementById('search-form').addEventListener("submit", function (e) {
    e.preventDefault();

    var searchTerm = searchInput.value.toLowerCase().trim();
    console.log(searchTerm);
    search(searchTerm);
    saveSearchHistory(searchTerm);
    searchInput.value = "";
    renderHistory();
});

// handler acts on click to create search
document.querySelector(".collection").addEventListener("click", function (e) {
    e.preventDefault();
    search(e.target.textContent);
    console.log(e.target.textContent);
});

// delete button click handler
document.getElementById('delete').addEventListener("click", function () {
    searchHistory = [];
    localStorage.clear();
    deleteSearchHistory();
});
