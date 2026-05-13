# Todo App

A simple todo app made for G360 and JLG. Uses Angular 19 on the frontend and .NET 9 on the backend. Todos are stored in memory and aren't persistant, but has been made so little work is required to use DB if connected.

## What you'll need

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) v18+
- Angular CLI `npm install -g @angular/cli`

## Running it locally

**Backend:**
```bash
cd backend/TodoApi
dotnet run
```

**Frontend:**
```bash
cd frontend/todo-app
npm install
ng serve
```

`http://localhost:4200`

## Tests

**Backend:**
```bash
cd backend
dotnet test
```

**Frontend unit tests:**
```bash
cd frontend/todo-app
ng test
```

**End to end with playwight:**
```bash
cd frontend/todo-app
npm run e2e
```

## Structure

The backend follows a simple repository pattern. Data access sits behind the `ITodoRepository` interface. It uses only a dictionary to store values in memory, but can be swapped to a real database using a new repository class and replacing a line in `Program.cs`. Tried to architect it as if was using a real DB.

The frontend uses Angular signals for state and keeps all the API calls in `TodoService`.
