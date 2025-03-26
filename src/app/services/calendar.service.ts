import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Reminder } from '../interfaces/reminder';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  public reminders = new BehaviorSubject<Reminder[]>([]);
  reminders$ = this.reminders.asObservable();

  remindersDummyData: Reminder[] = [
    {
      dateTime: new Date(2025, 2, 4),
      text: "Doctor's appointment",
      color: '#008a63',
      city: 'Mexico',
      id: 1,
    },
    {
      dateTime: new Date(2025, 2, 4),
      text: "Doctor's appointment",
      color: '#008a63',
      city: 'Mexico',
      id: 11,
    },
    {
      dateTime: new Date(2025, 2, 4),
      text: "Doctor's appointment",
      color: '#008a63',
      city: 'Mexico',
      id: 12,
    },
    {
      dateTime: new Date(2025, 2, 4),
      text: "Doctor's appointment",
      color: '#008a63',
      city: 'Mexico',
      id: 13,
    },
    {
      dateTime: new Date(2025, 2, 4),
      text: "Doctor's appointment",
      color: '#008a63',
      city: 'Mexico',
      id: 14,
    },
    {
      dateTime: new Date(2025, 2, 4),
      text: "Doctor's appointment",
      color: '#008a63',
      city: 'Mexico',
      id: 15,
    },
    {
      dateTime: new Date(2025, 2, 31),
      text: 'Team meeting',
      color: '#a08a63',
      city: 'Tijuana',
      id: 2,
    },
    {
      dateTime: new Date(2025, 2, 15),
      text: 'Project deadline',
      color: '#00fa63',
      city: 'Guadalajara',
      id: 3,
    },
    {
      dateTime: new Date(2025, 2, 29),
      text: 'Family dinner',
      color: '#008ad3',
      city: 'Chihuahua',
      id: 4,
    },
    {
      dateTime: new Date(2025, 2, 28),
      text: 'Gym session',
      color: '#008a63',
      city: 'Mexico',
      id: 5,
    },
    {
      dateTime: new Date(2025, 3, 5),
      text: 'Gym session',
      color: '#008a63',
      city: 'Mexico',
      id: 5,
    },
  ];

  constructor() {}

  initDummyData() {
    this.reminders.next(this.remindersDummyData);
  }

  create(data: Reminder) {
    const currentReminders = this.reminders.getValue();
    this.reminders.next([...currentReminders, data]);
  }

  edit(data: Reminder) {
    const currentReminders = this.reminders.getValue();
    const index = currentReminders.findIndex(
      (reminder) => reminder.id === data.id
    );
    if (index !== -1) {
      currentReminders[index] = data;
      this.reminders.next([...currentReminders]);
    }
  }

  delete(data: Reminder) {
    const currentReminders = this.reminders.getValue();
    const updatedReminders = currentReminders.filter(
      (reminder) =>
        reminder.text !== data.text ||
        reminder.dateTime.getTime() !== data.dateTime.getTime()
    );
    this.reminders.next(updatedReminders);
  }
}
