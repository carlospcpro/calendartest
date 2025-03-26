import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { WeatherForecastI } from '../interfaces/weather';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = '74235fb7337c62e21975b82e38765d83';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiUrlForecast =
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<string> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).pipe(
      map((data) => {
        console.log('Weather Data:', data);
        return this.parseWeatherData(data); // Asegúrate de que parseWeatherData regrese un string
      }),
      catchError((error) => {
        console.error('Error fetching weather data:', error);
        return of('Error fetching weather data');
      })
    );
  }

  getWeatherForecast(city: string): Observable<WeatherForecastI> {
    const url = `${this.apiUrlForecast}/${city}?unitGroup=us&include=days&key=KXJGEFC6J6S3NVNCS93AR23G7&contentType=json`;

    return this.http.get<WeatherForecastI>(url).pipe(
      map((data) => {
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching weather data:', error);
        return throwError(() => new Error('Error fetching weather data'));
      })
    );
  }

  parseWeatherData(weatherData: any): string {
    const city = weatherData.name;
    const temperature = weatherData.main.temp;
    const feelsLike = weatherData.main.feels_like;
    const weatherDescription = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const windDegree = weatherData.wind.deg;
    const sunrise = new Date(
      weatherData.sys.sunrise * 1000
    ).toLocaleTimeString();
    const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();

    return `Weather in ${city}: - Temperature: ${temperature}°C (Feels like: ${feelsLike}°C) - Weather: ${weatherDescription} - Humidity: ${humidity}% - Wind: ${windSpeed} m/s, Direction: ${windDegree}° - Sunrise: ${sunrise} - Sunset: ${sunset}`;
  }
}
