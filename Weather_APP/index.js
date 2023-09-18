class SavedArea {
    constructor(id, location, temp, humidity, description, time){
        this.id = id;
        this.location = location;
        this.temp = temp;
        this.humidity = humidity;
        this.description = description;
        this.time = time;
    }
}

class SelectedAreas {
    constructor(){
        this.list = [];
        this.nextId = 0;
        
    }
    add(location, temp, humidity, description, time){
        let save = new SavedArea(++this.nextId, location, temp, humidity, description, time);
        this.list.push(save);
    }
    remove(saveId) {
        this.list = this.list.filter(({id}) => id != saveId);
    }
}


const submitBtn = document.querySelector("#submitBtn");
const refreshBtn = document.querySelector("#refreshBtn");
const addBtn = document.querySelector(".addBtn");
const removeBtn = document.querySelector("#remBtn");
const form = document.getElementById("form");
const apiKey = "b8629ff3a21c2ecfad8ae59fab192415";
const url = `https://api.openweathermap.org/geo/1.0/direct`;
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather`
const tempParagraph = document.getElementById("temp")
const humidityParagraph = document.getElementById("humidity")
const descriptionParagraph = document.getElementById("description")
const timeParagraph = document.getElementById("time")
const locationH4 = document.getElementById("location")
const areaSaved = document.querySelector('#wishListContainer > ul')
let selectedAreas = new SelectedAreas();
const cityName = document.getElementById("city");
const stateCode = document.getElementById("state");
const countryCode = document.querySelector("#country");

form.addEventListener("submit", (event) => {
    locationH4.textContent = `${cityName.value}, ${stateCode.value}, ${countryCode.value}`;
    fetchArea(event, cityName.value, stateCode.value, countryCode.value);
});

function addThing(e){
    let temp = document.getElementById("temp");
    let humidity = document.getElementById("humidity");
    let description = document.getElementById("description");
    let location = document.getElementById("location");
    let time = document.getElementById("time");
    e.preventDefault();
    selectedAreas.add(location.textContent, temp.textContent, humidity.textContent, description.textContent, time.textContent);
    console.log(selectedAreas.list);
};

function remThing(e){
    e.preventDefault();
    let remStatement = selectedAreas.list.find((area) => {
        return area.time === timeParagraph.textContent && area.location === locationH4.textContent
    });
    if (remStatement){selectedAreas.remove(remStatement.id)};
    updateDOMList();
 };

addBtn.addEventListener("click", (event) => {
    addThing(event) 
    updateDOMList()
});

refreshBtn.addEventListener("click", (event) => {
    let locArr = locationH4.textContent.split(", ");
    fetchArea(event, locArr[0], locArr[1], locArr[2]);
});

removeBtn.addEventListener("click", (event) => {
    remThing(event) 
    updateDOMList()
    
});

function fetchArea(event, city, state, country) {
    console.log(city, state, country);
    event.preventDefault();
    fetch(`${url}?q=${city},${state},${country}&limit=1&appid=${apiKey}`)
    .then((response) => {
        console.log(response);
        return response.json();
    })
    .then((result) =>{
        console.log(result);
        let lat = result[0]["lat"];
        let lon = result[0]["lon"];
        console.log(lat, lon);
        fetchWeather(lat, lon);
        cityName.value = "";
        stateCode.value = "";
        countryCode.value = "";
    })
    .catch((err) =>{
        console.error(err);
    })
};

function fetchWeather(lat, lon){
    fetch(`${weatherUrl}?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then((response) => {
        console.log(response);
        return response.json();
    })
    .then((result) =>{
        console.log(result);
        console.log(result.main, result.weather[0]);
        parseWeatherData(result);
    })
    .catch((err) =>{
        console.error(err);
    })
}

function parseWeatherData(weatherData){
    let dataTemp = weatherData.main.temp;
    let dataHumidity = weatherData.main.humidity;
    let dataDescription = weatherData.weather[0].description;
    let tempP = document.getElementById("temp");
    tempP.textContent = dataTemp;
    let humidityP = document.getElementById("humidity");
    humidityP.textContent = dataHumidity;
    let descriptionP = document.getElementById("description");
    descriptionP.textContent = dataDescription;
    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let dateStr = `Time searched: ${month}/${day}, ${hour}:${minute}.${second}`;
    timeParagraph.textContent = dateStr;
}

function updateDOMList() {
    areaSaved.innerHTML = "";
    selectedAreas.list.forEach((savedArea) => {
        const li = document.createElement('li');
        li.textContent = `${savedArea.location}, ${savedArea.temp}, ${savedArea.humidity}, ${savedArea.description}, ${savedArea.time}`;
        li.addEventListener("click", () => showWeatherDetails(savedArea));
        areaSaved.appendChild(li);
    });
}

function showWeatherDetails(savedArea) {
    locationH4.textContent = savedArea.location;
    tempParagraph.textContent = savedArea.temp;
    humidityParagraph.textContent = savedArea.humidity;
    descriptionParagraph.textContent = savedArea.description;
    timeParagraph.textContent = savedArea.time;
}