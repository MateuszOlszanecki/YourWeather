const cityInput = document.querySelectorAll(".cityInput")
const weatherIcon = document.querySelectorAll(".weatherIcon")
const switchView = document.querySelectorAll(".switchView")
const cityDisplay = document.querySelectorAll(".cityDisplay")
const cityNameDisplay = document.querySelectorAll(".cityNameDisplay")
const cityTimeDisplay = document.querySelectorAll(".cityTimeDisplay")
const cityDateDisplay = document.querySelectorAll(".cityDateDisplay")
const infoBlocks = document.querySelectorAll(".infoBlock")
const normalView = document.querySelector(".normalView")
const specialView = document.querySelector(".specialView")
const body = document.querySelector("body");

const API_KEY = "e70b566188b9131e6106d004003528a0"

//set normalView to visible on start and specialView to not visible
window.onload = function() {
    cityDisplay[0].style.display = "none";
    cityDisplay[1].style.display = "none";

    normalView.style.display = "grid";
    specialView.style.display = "none";
}

weather = {
    city: null,
    temp: null,
    pressure: null,
    describtion: null,
    icon: null,
    sunrise: null,
    sunset: null,
    timezone: null
}

//request for weather info from http
async function getWeatherURL(city)
{
    let url = "http://api.openweathermap.org/data/2.5/weather?q="
            + city
            + "&APPID="
            + API_KEY
            + "&units=metric"
    let response = await fetch(url);
    if(response.ok){
        return await response.json();
    }
    errorClearer();
    return null;
}

//events for cityInput
cityInput.forEach((input, i) => {
//move view to position so that cityInput is on top
    input.addEventListener('click', () => {
        document.activeElement.blur();
        window.scrollTo(0,cityInput[i].offsetTop - 5)
        cityInput[i].focus()
    })

//confirm typed city to check its weather by pressing enter
    input.addEventListener('keypress', e => {
        if(e.key === 'Enter'){
            let city = cityInput[i].value.trim();
            cityInput[i].value = "";
    
            if(city == '') return

            cityDisplay[0].style.display = "grid";
            cityDisplay[1].style.display = "grid";

            document.activeElement.blur();
            getWeatherURL(city).then((data) => {
                if(data === null){
                    window.scrollTo(0,cityInput[i].offsetTop - 5)
                    cityInput[i].focus()
                    return
                }
    
                fishOutData(data);
                displayData();
                window.scrollTo(0,cityInput[i].offsetTop - 5)
            })
        }
    })
});

//switch view button
switchView.forEach(view => {
    view.addEventListener('click', () => {
        window.scrollTo(0,0)
        if(normalView.style.display === "grid"){
            body.style.background = getComputedStyle(document.documentElement).getPropertyValue('--specialViewBackgroundColor');
            cityInput[0].value = ""
            cityInput[1].value = ""
            normalView.style.display = "none"
            specialView.style.display = "grid"
        }
        else if(specialView.style.display === "grid"){
            body.style.background = getComputedStyle(document.documentElement).getPropertyValue('--normalViewBackgroundColor');
            cityInput[0].value = ""
            cityInput[1].value = ""
            normalView.style.display = "grid"
            specialView.style.display = "none"
        }
    })
});

//get wether info from JSON
function fishOutData(data){
    weather['city'] = data.name;
    weather['temp'] = data.main.temp;
    weather['pressure'] = data.main.pressure;
    weather['describtion'] = data.weather[0]['description'];
    weather['icon'] = data.weather[0]['icon'];
    weather['sunrise'] = data.sys.sunrise;
    weather['sunset'] = data.sys.sunset;
    weather['timezone'] = data.timezone;
}

//display all data on page
function displayData(){
    //display city name
    cityNameDisplay[0].innerHTML = weather['city']
    cityNameDisplay[1].innerHTML = cityNameDisplay[0].innerHTML
    
    //display time and date
    let timeDate = new Date(Date.now() + weather['timezone'] * 1000)
    cityTimeDisplay[0].innerHTML = timeDate.toISOString().slice(11,16)
    cityTimeDisplay[1].innerHTML = cityTimeDisplay[0].innerHTML

    cityDateDisplay[0].innerHTML = timeDate.toISOString().slice(8,10)
                                 + "."
                                 + timeDate.toISOString().slice(5,7)
                                 + "."
                                 + timeDate.toISOString().slice(0,4)
    cityDateDisplay[1].innerHTML = cityDateDisplay[0].innerHTML

    //display icon
    weatherIcon[0].src = "https://openweathermap.org/img/wn/"
                       + weather['icon']
                       + "@2x.png"
    weatherIcon[1].src = weatherIcon[0].src

    for(let i = 0; i < 2; i++){
        //display desc
        infoBlocks[0 + 5*i].innerHTML = weather['describtion']
        //display temp
        infoBlocks[1 + 5*i].innerHTML = Math.round(weather['temp']) + "\xB0C";
        //display pressure
        infoBlocks[2 + 5*i].innerHTML = weather['pressure'] + " hPa";
        //display sunrise
        infoBlocks[3 + 5*i].innerHTML = new Date((weather['sunrise'] + weather['timezone']) * 1000).toISOString().slice(11, 16);
        //display sunset
        infoBlocks[4 + 5*i].innerHTML = new Date((weather['sunset'] + weather['timezone']) * 1000).toISOString().slice(11, 16);
    }

}

function errorClearer(){
    cityNameDisplay[0].innerHTML = "City not found"
    cityNameDisplay[1].innerHTML = cityNameDisplay[0].innerHTML
    cityTimeDisplay[0].innerHTML = ""
    cityTimeDisplay[1].innerHTML = cityTimeDisplay[0].innerHTML
    cityDateDisplay[0].innerHTML = ""
    cityDateDisplay[1].innerHTML = cityDateDisplay[0].innerHTML
    weatherIcon[0].src = "icons/normalViewBlankTile.png"
    weatherIcon[1].src = "icons/specialViewBlankTile.png"
    for(let i = 0; i < 10; i++){
        infoBlocks[i].innerHTML = ""
    }
}