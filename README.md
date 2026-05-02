# Essence Salon & Spa

A full-stack web application for Essence Salon & Spa, featuring a client-facing website and an admin dashboard for managing appointments and services.

## Project Structure

The project is divided into two main parts:

- **Frontend**: A static website built with HTML, CSS, and JavaScript.
- **Backend**: A Node.js/Express server with an SQLite database.

## Features

- **Client Facing Website (`frontend/index.html`)**: Beautiful, premium dark-mode aesthetic for viewing services, an about section, reviews, and a contact/booking form.
- **Admin Dashboard (`frontend/admin.html`)**: A dashboard for salon administrators to manage bookings and contact form submissions.
- **Backend API (`backend/server.js`)**: REST API to handle form submissions, appointments, and database operations.
- **Database**: SQLite database (`essence_salon.db`) to store appointment and customer data.

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Other Dependencies**: `cors`, `body-parser`

## Setup and Installation

1. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the server:
     ```bash
     npm start
     ```
   - The backend server will run (typically on `http://localhost:3000`).

2. **Frontend Setup**:
   - Open the frontend files (`frontend/index.html` and `frontend/admin.html`) in your web browser. Or, use a static file server like Live Server (VS Code extension) to serve the `frontend` directory.

## Usage

- Clients can visit the main page (`index.html`) to view services and book appointments.
- Administrators can visit the admin page (`admin.html`) to review bookings and manage the salon's schedules.
