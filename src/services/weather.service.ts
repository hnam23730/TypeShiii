import axios from 'axios';
class WeatherService {
    static async getCurrentWeather(cityName: string) : Promise<any>{
        // call api
        const urlAPI = "https://api.openweathermap.org/data/2.5/weather";
        const data = await axios.get(urlAPI, {
            params: {
                q: cityName,
                appid: "dace8f65054f0e7b9d8de6e7a19cff7d"
            }
        });
        return data;
    }
}

export default WeatherService;