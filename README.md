# Job Application Tracker

A full-stack job application tracker with a Vue 3 frontend and an ASP.NET Core Web API backend. Track job applications, update statuses, and persist data to SQLite.

## Features

- Add, view, edit, and delete job applications
- Search by company name or job title
- Filter by application status
- Track application workflow states: Interested, Applied, Interviewing, Offer, Rejected, Archived
- Backend persistence with Entity Framework Core and SQLite

## Tech Stack

### Frontend
- Vue 3
- Vite
- TypeScript
- ESLint
- Vitest

### Backend
- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQLite

## Architecture

```text
Vue 3 + Vite
   ↓
ASP.NET Core Web API
   ↓
Entity Framework Core
   ↓
SQLite
```

The frontend communicates with the backend through REST endpoints. The backend handles data access, business logic, and SQLite persistence.

## Project Structure

```text
job-app-tracker.sln
├── api
│   └── JobAppTrackerApi
├── ui
│   ├── angular-legacy
│   └── job-app-tracker-vue
└── README.md
```

> The previous Angular implementation has been moved to `ui/angular-legacy`. The main frontend is now the Vue application at `ui/job-app-tracker-vue`.

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 20 or later
- npm

### Backend Setup

```bash
cd api/JobAppTrackerApi
dotnet restore
dotnet ef database update
dotnet run
```

This starts the API. The exact URL and port will be shown in the console output (typically `https://localhost:7289` or similar).

### Frontend Setup

```bash
cd ui/job-app-tracker-vue
npm install
npm run dev
```

The Vue frontend will be served by Vite, usually at:

```text
http://localhost:5173
```

## API Endpoints

### Job Applications

- GET `/api/jobapplications`
- GET `/api/jobapplications/{id}`
- POST `/api/jobapplications`
- PUT `/api/jobapplications/{id}`
- DELETE `/api/jobapplications/{id}`

## Status Values

- Interested ⭐
- Applied 📤
- Interviewing 🗣️
- Offer 💼
- Rejected ❌
- Archived 🗄️

## Local Development Commands

From `ui/job-app-tracker-vue`:

```bash
npm run dev          # start development server
npm run build        # build production bundle
npm run preview      # preview production build
npm run test:unit    # run Vitest unit tests
npm run lint         # lint source files
npm run format       # format source files
```

## Notes

- If the backend is running on a different port than the frontend, update the Vue app API base URL as needed.
- Keep `ui/angular-legacy` for reference or migration history; the active frontend is in `ui/job-app-tracker-vue`.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

George Louie Conde  
Software Developer  
Calgary, AB  
[LinkedIn](https://linkedin.com/in/glconde)  
[GitHub](https://github.com/glconde)

## Version

0.1.0
