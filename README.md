# react-native-restful-api

# Car Inventory Manager

## Project Description
This project is a React Native application with a Node.js backend and SQLite database. It allows users to manage a car inventory collection using a RESTful API.

## Technologies Used
- **Backend**: Node.js, Express, SQLite
- **Frontend**: React Native, Expo

## How to Run

### Backend:
1. Navigate to the `backend` folder:
   ```bash
   cd backend

   Install dependencies:
npm install

Start the server:
node index.js
The server will run on http://localhost:3001.

Frontend:
Navigate to the frontend folder
cd frontend

Install dependencies:
npm install

Start the app:
npx expo start


Use an emulator or Expo Go app to run the project.
RESTful API Routes
GET /api/: Retrieve all cars.
POST /api/: Add a new car.
PUT /api/:id: Update a car.
DELETE /api/:id: Delete a car.
DELETE /api/: Clear all cars.
PUT /api/: Replace the collection.
