# School Management Mini System

A full-stack School Management System built using the MERN stack (MongoDB, Express.js, React, Node.js) with Tailwind CSS v4 and Framer Motion for a premium, dynamic UI.

## Features

- **Authentication**: JWT-based login for administrators.
- **Dashboard**: Animated statistics cards summarizing total tracking metrics.
- **Student Management**: Full CRUD capability for student records.
- **Task Management**: Assign tasks to students with due dates and track their status.
- **Modern UI**: Smooth Framer Motion transitions, responsive design, and glassmorphism styling via Tailwind CSS.

## Setup Instructions

### Prerequisites
- Node.js (Latest version recommended, v18+)
- MongoDB connection URI (Cloud or Local daemon `mongodb://127.0.0.1:27017/school_management`)

### 1. Backend Setup

1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Establish your environment variables. A `.env` file is already created:
   ```env
   MONGO_URI=your_mongodb_uri_here
   JWT_SECRET=super_secret_key_change_me_in_prod
   PORT=5000
   ```
4. Start the backend:
   ```bash
   node server.js
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:5173` in your browser.

## API Endpoints Reference

### Auth
- `POST /api/auth/register`: Register a new admin user.
   - Body: `{ "name": "Admin", "email": "admin@school.com", "password": "password" }`
- `POST /api/auth/login`: Login admin and receive JWT.

### Students (Requires JWT)
- `GET /api/students`: Retrieve all students.
- `POST /api/students`: Create a new student.
- `PUT /api/students/:id`: Update a student.
- `DELETE /api/students/:id`: Remove a student.

### Tasks (Requires JWT)
- `GET /api/tasks`: Retrieve all assigned tasks.
- `POST /api/tasks`: Assign a new task.
- `PUT /api/tasks/:id`: Update task details or mark complete (`status: 'completed'`).
- `DELETE /api/tasks/:id`: Delete a task.

## Example Flow

1. Register an initial admin by sending a `POST` to `http://localhost:5000/api/auth/register` (e.g. using Postman/cURL) or use any pre-seeded admin.
2. Login through the web interface at `/login`.
3. You'll be redirected to the Dashboard.
4. Add new students via the Students section.
5. Create Tasks and assign them to the students you added in the Tasks section. 
6. Watch the dashboard stats automatically update!
