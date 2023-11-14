import Express from "express";
import cors from "cors";
import https from "https";
import http from'node:http';
import axios from "axios";
import fetch from 'node-fetch';
import { Console } from "console";

var app = Express();
app.use(cors());

const apiOpenWeather = {
    key: "61f536c7ec3e62f7c4d43412de9977c8",
    base: "https://api.openweathermap.org/data/2.5/"
}

const apiAccuWeather = {
    key: "6WocAdxr04HNMhEDlvPYkJePZR5RE3ms",
    // key: "evJqjQoI3glUTIMos9DlAuiPfszayhZy",
    base: "http://dataservice.accuweather.com/currentconditions/v1/",
    baseCity: "http://dataservice.accuweather.com/locations/v1/cities/search"
}

const apiOpenMeteo = {
    base: "https://api.open-meteo.com/v1/forecast"
}

const apiTomorrowIO = {
    key: "XLLe2XW6eFdCNP8brMq2v9TrmfzXoNlG",
    base:  "https://api.tomorrow.io/v4/weather/realtime"
}

const apiVisualCrossing = {
    key: "6XCP3LPX3SVQJZY2V5KPGR6JX",
    base: "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
}

const apiWeatherApi = {
    key: "69940ab6788749eb989205344231111",
    base: "http://api.weatherapi.com/v1/current.json"
}

var DATABASENAME = "weatherappdb"
var database;

app.listen(5038, ()=>{ 
});

const getCoordinates = async function(cityName) {
    try {
        const response = await axios.get(`${apiOpenWeather.base}weather?q=${cityName}&appid=${apiOpenWeather.key}&units=metric`);
        console.log(response.data.coord);
        return response.data.coord;
    } catch (error) {
        console.error("Could not find city", error);
        return {lon: "15.63", lat: "46.55"};
    }
};


async function resolceAllAPIs(cityName, lon = "15.63", lat = "46.55"){
    const tempArray = [];
    const humidityArray = [];
    const windSpeedArray = [];
    const windDegreeArray = [];
    var geoKey = "299438";
    var weather = {};
    var realCityName = "";
    /*try {
        const rest = await axios.get(`${apiAccuWeather.baseCity}?apikey=${apiAccuWeather.key}&q=${cityName}&details=false`);
        lon = rest.data[0].GeoPosition.Longitude;
        lat = rest.data[0].GeoPosition.Latitude;
        geoKey = rest.data[0].Key;
    } catch (error) {
        console.log(error);
    }*/
    
    try {
        const rest1 = await axios.get(`${apiOpenWeather.base}weather?q=${cityName}&appid=${apiOpenWeather.key}&units=metric`);
        tempArray.push(rest1.data.main.temp);
        humidityArray.push(rest1.data.main.humidity);
        windSpeedArray.push(rest1.data.wind.speed);
        windDegreeArray.push(rest1.data.wind.deg);
        weather = rest1.data.weather[0];
        realCityName = rest1.data.name;
    } catch (error) {}

    
    /*try {
        const rest2 = await axios.get(`${apiAccuWeather.base}/${geoKey}?apikey=${apiAccuWeather.key}&details=true`);
        weather = rest2.data[0].WeatherText;
        tempArray.push(rest2.data[0].Temperature.Metric.Value);
        humidityArray.push(rest2.data[0].RelativeHumidity);
        windSpeedArray.push(rest2.data[0].Wind.Direction.Degrees);
        windDegreeArray.push(rest2.data[0].WindGust.Speed.Metric.Value);
    } catch (error) {}*/

    
    try {
        const rest3 = await axios.get(`${apiMeteorologisk.base}?lat=${lat}&lon=${lon}`);
        tempArray.push(rest3.data[0].properties.timeseries[0].data.instant.details.air_temperature);
        humidityArray.push(rest3.data[0].properties.timeseries[0].data.instant.details.relative_humidity);
        windSpeedArray.push(rest3.data[0].properties.timeseries[0].data.instant.details.wind_from_direction);
        windDegreeArray.push(rest3.data[0].properties.timeseries[0].data.instant.details.wind_speed);
    } catch (error) {}

    
    try {
        const rest4 = await axios.get(`${apiOpenMeteo.base}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m`);
        tempArray.push(rest4.data.current.temperature_2m);
        humidityArray.push(rest4.data.current.relative_humidity_2m);
        windSpeedArray.push(rest4.data.current.wind_speed_10m);
        windDegreeArray.push(rest4.data.current.wind_direction_10m);
    } catch (error) {}

    
    try {
        const rest5 = await axios.get(`${apiTomorrowIO.base}?location=${cityName}&apikey=${apiTomorrowIO.key}`);
        tempArray.push(rest5.data.data.values.temperature);
        humidityArray.push(rest5.data.data.values.humidity);
        windSpeedArray.push(rest5.data.data.values.windGust);
        windDegreeArray.push(rest5.data.data.values.windDirection);
    } catch (error) {}

    
    try {
        const rest6 = await axios.get(`${apiVisualCrossing.base}${cityName}/today?unitGroup=metric&include=current&key=${apiVisualCrossing.key}&contentType=json`);
        tempArray.push(rest6.data.currentConditions.temp);
        humidityArray.push(rest6.data.currentConditions.humidity);
        windSpeedArray.push(rest6.data.currentConditions.windspeed);
        windDegreeArray.push(rest6.data.currentConditions.winddir);
    } catch (error) {}

    
    try {
        const rest7 = await axios.get(`${apiWeatherApi.base}?key=${apiWeatherApi.key}&q=${cityName}&aqi=yes`);
        tempArray.push(rest7.data.current.temp_c);
        humidityArray.push(rest7.data.current.humidity);
        windSpeedArray.push(rest7.data.current.wind_kph);
        windDegreeArray.push(rest7.data.current.wind_degree);
    } catch (error) {}

    const temperature = tempArray.reduce((accumulator, currentValue) => accumulator + currentValue,
    0,) / tempArray.length;
    const humidity = humidityArray.reduce((accumulator1, currentValue1) => accumulator1 + currentValue1,
    0,) / humidityArray.length;
    const windSpeed = windSpeedArray.reduce((accumulator2, currentValue2) => accumulator2 + currentValue2,
    0,) / windSpeedArray.length;
    const windDegree = windDegreeArray.reduce((accumulator3, currentValue3) => accumulator3 + currentValue3,
    0,) / windDegreeArray.length;

    return {weather, temperature, humidity, windSpeed, windDegree, cityName: realCityName};
}

app.get("/:cityName", async function(req, res){
    const {lon, lat} = await getCoordinates(req.params.cityName);
    const values = await resolceAllAPIs(req.params.cityName, lon, lat);
    res.send(JSON.stringify(values));
});
