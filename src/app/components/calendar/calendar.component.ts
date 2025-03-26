import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Reminder } from '../../interfaces/reminder';
import { CalendarService } from '../../services/calendar.service';
import { WeatherService } from '../../services/weather.service';
import { MatDialog } from '@angular/material/dialog';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject<boolean>();
  dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  monthDays: any = [];
  reminders: Reminder[] = [];
  currentMonthName: string | undefined;
  currentYear: number | undefined;

  constructor(
    private calendarService: CalendarService,
    private matDialog: MatDialog,
    private weatherService: WeatherService
  ) {}

  getReminders() {
    this.calendarService.reminders$.subscribe((reminders) => {
      this.reminders = reminders;
      this.populateReminders();
    });
  }

  initDummyData() {
    this.calendarService.initDummyData();
    this.populateReminders();
  }

  clearData() {
    this.reminders = [];
    this.populateReminders();
  }

  ngOnInit(): void {
    this.getReminders();
    this.getCalendarDays();
  }

  getCalendarDays() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    this.currentYear = year;
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this.currentMonthName = monthNames[new Date().getMonth()];

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const totalDays = lastDayOfMonth.getDate();
    const firstWeekday = firstDayOfMonth.getDay();

    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const calendar: {
      day: number;
      current: boolean;
      isWeekend: boolean;
      reminders: { day: number; text: string }[];
    }[] = new Array(42);

    for (let i = 0; i < firstWeekday; i++) {
      const dayOfWeek = i % 7;
      calendar[i] = {
        day: prevMonthLastDay - firstWeekday + 1 + i,
        current: false,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        reminders: [],
      };
    }

    for (let i = 0; i < totalDays; i++) {
      const dayOfWeek = (firstWeekday + i) % 7;
      calendar[firstWeekday + i] = {
        day: i + 1,
        current: true,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        reminders: [],
      };
    }

    for (let i = firstWeekday + totalDays; i < 42; i++) {
      const dayOfWeek = i % 7;
      calendar[i] = {
        day: i - (firstWeekday + totalDays) + 1,
        current: false,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        reminders: [],
      };
    }

    this.monthDays = calendar;
    this.populateReminders();
  }

  populateReminders() {
    const reminders: Reminder[] = this.reminders;

    this.monthDays.forEach(
      (day: {
        day: number;
        current: any;
        reminders: { dateTime: Date; text: string }[];
      }) => {
        const dayReminders = reminders.filter((reminder) => {
          const reminderDate = new Date(reminder.dateTime);

          return (
            reminderDate.getDate() === day.day &&
            reminderDate.getMonth() === new Date().getMonth() &&
            reminderDate.getFullYear() === new Date().getFullYear() &&
            day.current
          );
        });

        day.reminders = [...dayReminders];
      }
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  openReminderForm(reminder?: Reminder) {
    this.matDialog.open(ReminderFormComponent, {
      data: reminder,
    });
  }
}
