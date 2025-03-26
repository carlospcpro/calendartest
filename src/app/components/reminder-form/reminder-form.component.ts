import { CalendarService } from './../../services/calendar.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reminder } from '../../interfaces/reminder';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { DayInterface } from '../../interfaces/weather';

export interface ReminderForm {
  text: string;
  dateTime: string;
  color: string;
  city?: string;
}

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss'],
})
export class ReminderFormComponent implements OnInit {
  reminderForm: FormGroup;
  isEditing: boolean = false;
  weatherData: string = 'No weather information available';
  dateSelected: Date | undefined;
  formRemider: FormGroup | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Reminder,
    private fb: FormBuilder,
    private calendarService: CalendarService,
    private dialogRef: MatDialogRef<ReminderFormComponent>,
    private weatherService: WeatherService
  ) {
    this.reminderForm = this.createFormGroup();
    this.isEditing = false;
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditing = true;
      this.populateFormWithData(this.data);
      this.getWeatherForecast();
    }
  }

  getWeatherForecast() {
    if (!this.data.city) {
      return;
    }

    this.weatherService.getWeatherForecast(this.data.city).subscribe(
      (r) => {
        if (!r.days) {
          console.error('Days not found in response');
          return;
        }

        let weather = this.findDayByDate(
          r.days,
          this.formRemider?.value.dateTime
        );

        if (!weather) {
          console.error('Weather not found for the given date');
          return;
        }
        this.weatherData = weather;
      },
      (error) => {
        console.error('Error fetching weather data:', error);
      }
    );
  }

  findDayByDate(days: DayInterface[], date: string): string | null {
    if (!Array.isArray(days) || typeof date !== 'string') {
      console.error('Invalid parameters');
      return null;
    }

    const formattedDate = date.split('T')[0];

    const day = days.find((day) => day.datetime === formattedDate);

    if (!day) return null;

    return `
        <div class="weather-card">
          <div class="weather-card-title">
            <p> <span>🌤️</span> ${new Date(day.datetime).toDateString()}</p>
          </div>
            <div class="data-cont-one">
                <p> ${day.description}</p>
            </div>
          <hr>
        <div class="grid-weather-one">
          <div class="temperature">
            <div class="left-bar"></div>
            <div class="right-content">
              <p><b>Max</b> ${day.tempmax}°F</p>
              <p><b>Avg</b> ${day.temp}°F</p>
              <p><b>Min</b> ${day.tempmin}°F</p>
            </div>
          </div>
          <div class="misc-weather">
            <div class="data-cont">
              <span>💧</span>
              <div>
              <p> ${day.humidity}%</p>
              <strong> Humidity</strong>
              </div>
            </div>

            <div class="data-cont">
              <span>💨</span>
              <div>
              <p> ${day.windspeed} mph, Direction ${day.winddir}°</p>
              <strong>Wind</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private createFormGroup(): FormGroup {
    this.formRemider = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(30)]],
      dateTime: [null, Validators.required],
      color: ['#000000', Validators.required],
      city: ['', Validators.required],
      id: [Number(new Date()), Validators.required],
    });
    return this.formRemider;
  }

  private populateFormWithData(data: Reminder): void {
    const formattedData = {
      ...data,
      dateTime: this.formatDateToISO(data.dateTime),
    };
    this.reminderForm.patchValue(formattedData);
  }

  private formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  get text() {
    return this.reminderForm.get('text');
  }

  get dateTime() {
    return this.reminderForm.get('dateTime');
  }

  onSubmit(): void {
    if (this.reminderForm.valid) {
      const reminder: Reminder = this.buildReminderFromForm();
      this.createReminder(reminder);
    }
  }

  delete() {
    this.calendarService.delete(this.data);
    this.dialogRef.close();
  }

  private buildReminderFromForm(): Reminder {
    const formValue = this.reminderForm.value;
    return {
      ...formValue,
      dateTime: new Date(formValue.dateTime),
    };
  }

  private createReminder(reminder: Reminder): void {
    if (this.isEditing === true) {
      this.calendarService.edit(reminder);
      this.isEditing = false;
    } else {
      this.calendarService.create(reminder);
    }
    this.dialogRef.close();
  }
}
