import axios from 'axios';
class WeatherService {
    static async getCurrentWeather(cityName: string) : Promise<any>{
        // call api
        const urlAPI = "https://api.openweathermap.org/data/2.5/weather";
        const data = await axios.get(urlAPI, {
            params: {
                q: cityName,
<<<<<<< Updated upstream
                appid: "c401a010b6f63142bf1e3b514d1d559e"
=======
                appid: "dace8f65054f0e7b9d8de6e7a19cff7d"
>>>>>>> Stashed changes
            }
        });
        return data;
    }
}

export default WeatherService;