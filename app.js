const searchBtn = document.querySelector("#search-btn");
const heroSec = document.querySelector(".hero-sec");
const cityName = document.querySelector("#search");
const cardSec = document.querySelector(".card-sec");
const temp = document.querySelector(".temp");
const humData = document.querySelector(".hum-data");
const rainData = document.querySelector(".rain-data");
const windData = document.querySelector(".wind-data");
const uvData = document.querySelector(".uv-data");
const cityData = document.querySelector(".city");
const pic = document.querySelector(".pic");
const condition = document.querySelector(".condition");
const body = document.querySelector("body");
const day = document.querySelector(".day");
const time = document.querySelector(".time");
const loadingCard = document.querySelector(".loading-card");

const dayArray =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function spaceHandling(cityName) {
	if (cityName.value.trim() === "") {
		alert("Please enter a city name.");
    	return false;
	}
	else{
		return true;
	}
}


function showLoading(){
    loadingCard.style.display = "flex";
    searchBtn.disabled = true;
    searchBtn.innerHTML = "Searching...";
}


 function hideLoading(){
	loadingCard.style.display = "none";
    searchBtn.disabled = false;
    searchBtn.innerHTML = "Search";
 }

// for number change animaton

function animateNumber(element, target, suffix) {

    let current = 0;

    let timer = setInterval(() => {

        current++;

        element.innerHTML = current + suffix;

        if (current >= target) {
            clearInterval(timer);
        }

    }, 30);

}

// for live clock

let clockInterval;

function startClock(){
	clearInterval(clockInterval);
	clockInterval = setInterval(()=>{
		let now = new Date();
		day.innerHTML=dayArray[now.getDay()];
		time.innerHTML = `${now.getHours().toString().padStart(2,"0")} : ${now.getMinutes().toString().padStart(2,"0")} : ${now.getSeconds().toString().padStart(2,"0")}`;
	},1000);

};

// background theme update

function updateBackground(theme){
	body.classList.forEach((className)=>{
	if(className.endsWith("-bg")){
		body.classList.remove(className);
	}
	});
	body.classList.add(theme);
};

// update number animation call

function animateWeatherNumbers(weatherData){
	animateNumber(temp,weatherData.current.apparent_temperature,"&#176;C");

	animateNumber(humData,weatherData.current.relative_humidity_2m,"%");

	animateNumber(rainData,weatherData.current.rain,"mm");

	animateNumber(windData,weatherData.current.wind_speed_10m,"km/h");

	animateNumber(uvData,weatherData.daily.uv_index_max[0],"");
};

// city, picture and location update

function updateWeatherData(locationData, weatherCode){

    cityData.innerHTML = `${locationData.results[0].name}, ${locationData.results[0].country}`;

    pic.style.backgroundImage =
        `url("${weatherCodes[weatherCode].image}")`;

    condition.innerHTML =
        weatherCodes[weatherCode].text;

}

const getWeather = async()=>{
	showLoading();
try {
	heroSec.classList.add("active");
	cardSec.classList.add("active");

	//position track
	const positionURL = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName.value}&count=10&language=en&format=json`;
    let response = await fetch(positionURL);
    let data = await response.json();

	// incorrect city handling
	if (!data.results || data.results.length === 0){
    	alert("City not found, Please check the spelling.");
		return;
	}

	const lat = data.results[0].latitude;
	const long = data.results[0].longitude;


	//weather track

	const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=uv_index_max&current=relative_humidity_2m,rain,weather_code,wind_speed_10m,apparent_temperature`;
	let response2 = await fetch(weatherURL);
    let weatherData = await response2.json();
	
	animateWeatherNumbers(weatherData);// data change accordint to city

	const code = weatherData.current.weather_code;
	updateWeatherData(data, code);// city, picture and location update


	updateBackground(weatherCodes[code].theme);// theme update
	
	startClock(); // for live clock

} 
catch (error) {
	console.error(error);
	alert(error.message);
}
finally{
	hideLoading();
}
}
 const weatherCodes = {
	0:{
		image : "assets/sunny.webp",
		text : "☀ Clear Sky",
		theme : "sunny-bg",
 	},
	1:{
		image : "assets/cloudy.webp",
		text : "☁ Mainly clear",
		theme : "cloudy-bg",
 	},
	2:{
		image : "assets/cloudy.webp",
		text : "☁ Partly Cloudy",
		theme : "cloudy-bg",
 	},
	3:{
		image : "assets/cloudy.webp",
		text : "☁ Overcast",
		theme : "cloudy-bg",
 	},
	45:{
		image : "assets/fog.png",
		text : "🌫 Fog",
		theme : "cloudy-bg",
 	},
	48:{
		image : "assets/fog.png",
		text : "🌫 Depositing Rime Fog",
		theme : "cloudy-bg",
 	},
	51:{
		image : "assets/drizzle.webp",
		text : "🌧 Drizzle: Light",
		theme : "rain-bg",
	},
	53:{
		image : "assets/drizzle.webp",
		text : "🌧 Drizzle: moderate",
		theme : "rain-bg",
	},
	55:{
		image : "assets/drizzle.webp",
		text : "🌧 Drizzle: dense intensity",
		theme : "rain-bg",
	},
	56:{
		image : "assets/drizzle.webp",
		text : "🌧 Freezing Drizzle: Light",
		theme : "rain-bg",
	},
	57:{
		image : "assets/drizzle.webp",
		text : "🌧 Freezing Drizzle: dense intensity",
		theme : "rain-bg",
	},
	61:{
		image : "assets/rain.webp",
		text : "🌧 Rain: Slight",
		theme : "rain-bg",
	},
	63:{
		image : "assets/rain.webp",
		text : "🌧 Rain: moderate",
		theme : "rain-bg",
	},
	65:{
		image : "assets/rain.webp",
		text : "🌧 Rain: heavy intensity",
		theme : "rain-bg",
	},
	66:{
		image : "assets/rain.webp",
		text : "🌧 Freezing Rain: Light",
		theme : "rain-bg",
	},
	67:{
		image : "assets/rain.webp",
		text : "🌧 Freezing Rain: heavy intensity",
		theme : "rain-bg",
	},
	80:{
		image : "assets/rain.webp",
		text : "🌧 Rain showers: Slight",
		theme : "rain-bg",
	},
	81:{
		image : "assets/rain.webp",
		text : "🌧 Rain showers: moderate",
		theme : "rain-bg",
	},
	82:{
		image : "assets/rain.webp",
		text : "🌧 Rain showers: violent",
		theme : "rain-bg",
	},
	71:{
		image : "assets/snow.webp",
		text : "❄ Snow fall: Slight",
		theme : "snow-bg",
	},
	73:{
		image : "assets/snow.webp",
		text : "❄ Snow fall: moderate",
		theme : "snow-bg",
	},
	75:{
		image : "assets/snow.webp",
		text : "❄ Snow fall: heavy intensity",
		theme : "snow-bg",
	},
	77:{
		image : "assets/snow.webp",
		text : "❄ Snow grains",
		theme : "snow-bg",
	},
	85:{
		image : "assets/snow.webp",
		text : "❄ Snow showers slight",
		theme : "snow-bg",
	},
	86:{
		image : "assets/snow.webp",
		text : "❄ Snow showers heavy",
		theme : "snow-bg",
	},
	95:{
		image : "assets/thunder.webp",
		text : "⛈ Thunderstorm: Slight",
		theme : "thunder-bg",
	},
	96:{
		image : "assets/thunder.webp",
		text : "⛈ Thunderstorm with slight",
		theme : "thunder-bg",
	},
	99:{
		image : "assets/thunder.webp",
		text : "⛈ Thunderstorm with heavy hail",
		theme : "thunder-bg",
	},
}

searchBtn.addEventListener("click",(event)=>{
    event.preventDefault();
	if (!spaceHandling(cityName)){
		return;
	};
    // heroSec.classList.add("active");
	// cardSec.classList.add("active");
	getWeather();
});
