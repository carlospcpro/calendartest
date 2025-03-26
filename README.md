# Angular Calendar Application

## Overview

This is an Angular-based calendar application that allows users to add and manage reminders. The application also retrieves and displays the weather forecast for a given city, but only if the reminder's date is the current date or later within the same month.

## Features

- Users can add reminders (max. 30 characters) to any date and time within the current month.
- Reminders can be edited, including text, city, date, and time.
- The weather forecast is retrieved from [Visual Crossing](https://www.visualcrossing.com/weather/weather-data-services#) and displayed inside a modal.
- The weather is only shown for reminders with dates on or after the current date within the same month.

## Running the Project

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 18.x or later recommended)
- [Angular CLI](https://angular.io/cli)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <project-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Application

Start the development server:

```sh
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will reload automatically if you make changes to the source files.

## Usage

1. Open the calendar view.
2. Click on any date within the current month to add a reminder.
3. Enter the reminder text, select a time, and choose a city.
4. If the reminder date is today or later within the same month, the weather will be retrieved and displayed inside a modal.
5. Click on a reminder to edit or update it.

## Building the Project

To create a production build:

```sh
ng build
```

The output will be in the `dist/` directory.

## Running Tests

### Unit Tests

Run the following command to execute unit tests:

```sh
ng test
```

## Additional Help

For more details on Angular CLI commands, visit the [Angular CLI Documentation](https://angular.dev/tools/cli).
