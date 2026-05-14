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

## Contact & Social

- **Instagram**: [essencesalon.in](https://www.instagram.com/essencesalon.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==)
- **WhatsApp**: [9909706587](https://wa.me/919909706587)
- **Address**: 104, 1st Floor, Dev Aditya, Thaltej - Shilaj Rd, Nr. Baghban Party Plot, Thaltej, Ahmedabad – 380059

## Setup and Installation

1. **Backend Setup**:
   - Navigate to the backend directory: `cd backend`
   - Install dependencies: `npm install`
   - Start the server: `npm start`

2. **Frontend Setup**:
   - The frontend is served by the backend at `http://localhost:3001`.
   - Alternatively, use a static file server to serve the `frontend` directory.

## Usage

- **Website**: Visit `http://localhost:3001` to view services and book appointments.
- **Admin**: Visit `http://localhost:3001/admin.html` to manage bookings. Use the master password to login.
