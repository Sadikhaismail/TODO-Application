TODO Application
Project Overview
This project is a full-stack web application designed to manage user tasks. It consists of a frontend built with React and a backend API developed using Node.js and Express. The app allows users to log in, register, view their tasks, and edit them. The backend API provides endpoints for authentication and task management.

Features:

User Authentication (Sign In/Sign Up)
Dashboard for viewing and managing tasks
Private routes for authenticated users
Task editor for creating and editing tasks
Technologies Used
Frontend: React, React Router, Context API, Axios
Backend: Node.js, Express, JWT (JSON Web Token), MongoDB
Styling: CSS, SCSS, Bootstrap
Version Control: Git, GitHub
How to Run the Project Locally
Prerequisites
Before you start, make sure you have the following installed on your local machine:

Node.js: Download Node.js
MongoDB: Install MongoDB (for backend)
Git: Download Git
Steps to Set Up
Clone the repository:

bash
Copy code
git clone https://github.com/Sadikhaismail/TODO-Application
cd TODO-Application
Set up the backend:

Navigate to the backend folder and install dependencies:

bash
Copy code
cd backend
npm install
Create a .env file in the backend folder and add the following variables (replace with your actual credentials):

plaintext
Copy code
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret_key>
Start the backend server:

bash
Copy code
npm start
Set up the frontend:

Navigate to the frontend folder and install dependencies:

bash
Copy code
cd frontend
npm install
Start the frontend development server:

bash
Copy code
npm start
The frontend will now be running on http://localhost:3000 and the backend on http://localhost:5000 (or your configured port).

Access the application: Open your browser and navigate to http://localhost:3000 to access the application.

Backend API Documentation
1. Authentication Routes
POST /api/auth/register
Description: Registers a new user.
Request Body:
json
Copy code
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123"
}
Response:
json
Copy code
{
  "message": "User registered successfully."
}
POST /api/auth/login
Description: Logs in an existing user.
Request Body:
json
Copy code
{
  "email": "user@example.com",
  "password": "password123"
}
Response:
json
Copy code
{
  "token": "jwt_token_here"
}
GET /api/auth/me
Description: Retrieves the authenticated user's profile.
Headers:
Authorization: Bearer <jwt_token>
Response:
json
Copy code
{
  "id": "user_id",
  "username": "user123",
  "email": "user@example.com"
}
2. Task Management Routes
GET /api/tasks
Description: Retrieves all tasks for the authenticated user.
Headers:
Authorization: Bearer <jwt_token>
Response:
json
Copy code
[
  {
    "id": "task_id",
    "title": "Task 1",
    "description": "This is task 1."
  },
  {
    "id": "task_id",
    "title": "Task 2",
    "description": "This is task 2."
  }
]
POST /api/tasks
Description: Creates a new task.
Request Body:
json
Copy code
{
  "title": "New Task",
  "description": "Task description here."
}
Response:
json
Copy code
{
  "message": "Task created successfully."
}
PUT /api/tasks/:id
Description: Updates an existing task.
Request Body:
json
Copy code
{
  "title": "Updated Task",
  "description": "Updated task description."
}
Response:
json
Copy code
{
  "message": "Task updated successfully."
}
DELETE /api/tasks/:id
Description: Deletes a task.
Response:
json
Copy code
{
  "message": "Task deleted successfully."
}
Notes
Replace <your_mongo_connection_string> and <your_jwt_secret_key> with actual values in the .env file.
Ensure that the backend server is running before accessing the frontend app to avoid any API call failures.
Key Sections:
Project Overview: Brief description of what the project is about.
Technologies Used: List of technologies used for frontend, backend, styling, and version control.
How to Run the Project Locally: Detailed steps to set up both frontend and backend on a local machine.
Backend API Documentation: Detailed information on the authentication and task management routes, including the structure of the request and response.

