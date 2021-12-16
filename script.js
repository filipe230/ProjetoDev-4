const api = {
  key: "d9341d16999246834886b8d7e8d141e2",
  base: "https://api.openweathermap.org/data/2.5/",
  lang: "pt_br",
  units: "metric"
}

const city = document.querySelector('.cidade');
const date = document.querySelector('.data');
const container_img = document.querySelector('.container-img');
const container_temp = document.querySelector('.container-temp');
const temp_number = document.querySelector('.container-temp div');
const temp_unit = document.querySelector('.container-temp span');
const weather_t = document.querySelector('.tempo');
const search_input = document.querySelector('.form');
const search_button = document.querySelector('.btn');
const low_high = document.querySelector('.min-max');

window.addEventListener('load', () => {
  //if("geolocation" in navigator)
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(setPosition, ShowError);
  }
  else{
    alert('Navegador não suporta geolocalização');
  }
  function setPosition(position){
    console.log(position);
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    coordResults(lat, long);
  }
  function ShowError(error){
    alert(`erro: ${error.message}`)
  }
})

function coordResults(lat, long) {
  fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
  .then(response => {
    if(!response.ok) {
      throw new Error(`http error: status ${response.status}`)
    }
    return response.json();
  })
  .catch(error => {
    alert(error.message)
  })
  .then(response => {
    displayResults(response)
  });
}

search_button.addEventListener('click', function() {
    searchResults(search_input.value)
})

search_input.addEventListener('keypress', enter)
function enter(event){
  key = event.keyCode
  if (key === 13){
    searchResults(search_input.value)
  }
}

function searchResults(city){
  fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
	.then(response => {
    console.log(response)
    if(!response.ok) {
      throw new Error(`http error: status ${response.status}`)
    }
    return response.json();
  })  
  .catch(error => {
    alert(error.message)
  })
  .then(response => {
    displayResults(response)
  });
}

function displayResults(weather) {
  console.log(weather)

  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  date.innerText = dateBuilder(now);
  
  let iconName = weather.weather[0].icon;
  container_img.innerHTML = `<img src="icons/${iconName}.png">`;

  let temperature = `${Math.round(weather.main.temp)}`;
  temp_number.innerHTML = temperature;
  temp_unit.innerHTML = `°C`;

  weather_tempo = weather.weather[0].description;
  weather_t.innerText = capitalizeFirstLetter(weather_tempo)

  low_high.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`
}

function dateBuilder(d) {
  let days = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "Sábado"];
  let months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  let day = days[d.getDay()]; //getDay: 0-6
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}

container_img.addEventListener('click', changeTemp)
function changeTemp(){
  temp_number_now = temp_number.innerHTML

  if(temp_unit.innerHTML === "°C"){
    let f = (temp_number_now * 1.8) + 32
    temp.innerHTML = "°F"
    temp_number.innerHTML = Math.round(f);
  }
  else {
    let c = (temp_number_now - 32) / 1.8
    temp_unit.innerHTML = "°C"
    temp_number.innerHTML = Math.round(c)
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}