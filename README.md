# Lessonboard

A school timetable and operations dashboard for managing lessons, events, and bell schedules.

## Features

- Timetable planning and lesson editing
- Teacher and admin workspace navigation
- Scheduled school events and bell system controls
- Lesson CRUD actions with persisted server-side data
- CSV export support for timetable and teacher reporting
- Vite + React + TypeScript frontend
- Express API backend with in-memory persistence

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Express
- TanStack Query
- Drizzle / Zod schema layer

## Getting started

### Install dependencies

```bash
npm install
```

### Run the app in development mode

```bash
npm run dev
```

The app will typically run on:

```text
http://localhost:5000
```

## Production build

```bash
npm run build
```

## Start the production server

```bash
npm run start
```

## Project structure

```text
client/         Frontend React app
server/         Express API and server setup
shared/         Shared validation/schema definitions
package.json    App scripts and dependencies
```

## Notes

This project includes a working timetable UI and lesson persistence flow, with server-backed lesson operations. The app is designed for local development and demonstration use.
