import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReminderFormComponent } from './reminder-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { CalendarService } from './../../services/calendar.service';
import { WeatherService } from './../../services/weather.service';
import { of } from 'rxjs';
import { DayInterface } from '../../interfaces/weather';
import { HttpClient } from '@angular/common/http';

describe('ReminderFormComponent', () => {
  let component: ReminderFormComponent;
  let fixture: ComponentFixture<ReminderFormComponent>;
  let mockCalendarService: jasmine.SpyObj<CalendarService>;
  let mockWeatherService: jasmine.SpyObj<WeatherService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ReminderFormComponent>>;

  beforeEach(async () => {
    mockCalendarService = jasmine.createSpyObj('CalendarService', [
      'create',
      'edit',
      'delete',
    ]);
    mockWeatherService = jasmine.createSpyObj('WeatherService', [
      'getWeatherForecast',
    ]);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ReminderFormComponent],
      imports: [HttpClient],
      providers: [
        FormBuilder,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            text: 'Test',
            dateTime: new Date(),
            color: '#ff0000',
            city: 'London',
          },
        },
        { provide: CalendarService, useValue: mockCalendarService },
        { provide: WeatherService, useValue: mockWeatherService },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly', () => {
    expect(component.reminderForm).toBeDefined();
    expect(component.reminderForm.valid).toBeFalse();
  });

  it('should populate form when data is provided', () => {
    expect(component.reminderForm.value.text).toBe('Test');
    expect(component.reminderForm.value.color).toBe('#ff0000');
    expect(component.reminderForm.value.city).toBe('London');
  });

  it('should call createReminder when form is valid and submitted', () => {
    component.reminderForm.patchValue({
      text: 'New Reminder',
      dateTime: new Date(),
      color: '#00ff00',
      city: 'Paris',
    });
    spyOn(component as any, 'createReminder');
    component.onSubmit();
    expect((component as any).createReminder).toHaveBeenCalled();
  });

  it('should call delete method in CalendarService', () => {
    component.delete();
    expect(mockCalendarService.delete).toHaveBeenCalledWith(component.data);
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call WeatherService when fetching weather data', () => {
    const mockWeatherData: { days: DayInterface[] } = {
      days: [
        {
          datetime: '2024-03-26',
          tempmax: 25,
          tempmin: 10,
          temp: 18,
          humidity: 50,
          windspeed: 10,
          winddir: 180,
          sunrise: '06:00',
          sunset: '18:00',
          description: 'Clear sky',
          conditions: 'Sunny',
          datetimeEpoch: 0,
          feelslikemax: 0,
          feelslikemin: 0,
          feelslike: 0,
          dew: 0,
          precip: 0,
          precipprob: 0,
          precipcover: 0,
          snow: 0,
          snowdepth: 0,
          windgust: 0,
          pressure: 0,
          cloudcover: 0,
          visibility: 0,
          solarradiation: 0,
          solarenergy: 0,
          uvindex: 0,
          severerisk: 0,
          sunriseEpoch: 0,
          sunsetEpoch: 0,
          moonphase: 0,
          icon: '',
          source: '',
        },
      ],
    };

    mockWeatherService.getWeatherForecast.and.returnValue(of(mockWeatherData));
    component.getWeatherForecast();
    expect(mockWeatherService.getWeatherForecast).toHaveBeenCalledWith(
      'London'
    );
  });
});
