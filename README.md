# Assignment 27 — React + MongoDB CRUD

## What this shows
- **One-to-Many**: One Teacher → Many Students (student stores teacher's ID)
- **Many-to-Many**: Students ↔ Courses (course stores array of student IDs)
- Full **CRUD**: Create, Read, Update, Delete for all three collections

## Setup & Run

### Requirements
- Node.js installed
- MongoDB running locally on port 27017

### Step 1 — Start MongoDB
```
mongod
```

### Step 2 — Start Backend
```
cd backend
npm install
npm start
```
Backend runs at: http://localhost:5000

### Step 3 — Start Frontend
```
cd frontend
npm install
npm start
```
Frontend runs at: http://localhost:3000

## Project Structure
```
backend/
  server.js      ← All routes + Mongoose models (one file)

frontend/src/
  App.js         ← All React UI + fetch calls (one file)
```

## MongoDB Collections
- **teachers** — { name }
- **students** — { name, teacher: ObjectId }        ← one-to-many
- **courses**  — { title, students: [ObjectId] }    ← many-to-many
