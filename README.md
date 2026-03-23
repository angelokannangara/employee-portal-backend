
# Project Title

A brief description of what this project does and who it's for

# Employee Portal Backend System

A production-grade RESTful backend for employee management with authentication, caching, and clean architecture.

## Features

- ✅ JWT Authentication with bcrypt password hashing
- ✅ Redis caching with Upstash (cache-aside pattern)
- ✅ Clean Architecture (Routes → Controllers → Services → Repositories → Models)
- ✅ Global error handling with custom AppError class
- ✅ Input sanitization and validation
- ✅ CORS configuration
- ✅ Supabase PostgreSQL database with proper relationships
- ✅ Comprehensive CRUD operations for Employees, Departments, Roles, and Attendance

## Tech Stack

- **Runtime**: Node.js v18+ with ES6 modules
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Caching**: Upstash Redis
- **Authentication**: JWT, bcryptjs
- **Validation**: Joi
- **Security**: CORS, express-mongo-sanitize, xss-clean

## Project Structure
```text
src/
├── config/         # Database and Redis configurations
├── controllers/    # Request/response handlers
├── repositories/   # Data access layer (DB queries)
├── services/       # Business logic layer
├── middlewares/    # Custom middleware (Auth, Validation)
├── models/         # Data models and validation schemas
├── routes/         # API route definitions
├── utils/          # Utility functions (Error/Response handlers)
├── app.js          # Express app configuration
└── server.js       # Server entry point
```


## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- Supabase account
- Upstash Redis account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd employee-portal-backend
```

2. Install dependencies:

```bash
npm install
```
3. Copy environment variables:

```bash
cp .env.example .env
```
4. Update .env with your credentials:

    Get Supabase URL and service key from your Supabase project

    Get Upstash Redis credentials from Upstash console

    Generate a secure JWT secret (32+ characters)

    Create database tables:

Copy the SQL from the Supabase Database Schema section

Run it in your Supabase SQL editor

## Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```
# Employee Management System API Documentation

This repository contains the REST API for managing employees, departments, roles, and attendance records. All responses are returned in JSON format.

## Table of Contents
- [Authentication](#authentication)
- [Employee Management](#employee-management)
- [Department Management](#department-management)
- [Role Management](#role-management)
- [Attendance & Leave](#attendance--leave)

---

## Authentication
Handles user registration, JWT-based login, and session management.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Login and receive a JWT |
| **GET** | `/api/auth/me` | Retrieve current user profile |
| **POST** | `/api/auth/logout` | Logout (blacklists current token) |
| **PUT** | `/api/auth/change-password` | Update account password |

---

## Employee Endpoints
Manage employee data. Results for "List" and "Single" views are cached for performance.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/employees` | List all employees (Paginated) |
| **GET** | `/api/employees/:id` | Get specific employee details |
| **GET** | `/api/employees/department/:deptId` | Filter employees by department |
| **POST** | `/api/employees` | Create a new employee record |
| **PUT** | `/api/employees/:id` | Update existing employee details |
| **DELETE** | `/api/employees/:id` | Soft delete an employee |

---

## Department Endpoints
Organize the workforce into departments.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/departments` | List all departments (Cached) |
| **GET** | `/api/departments/:id` | Get department details + employee count |
| **POST** | `/api/departments` | Create a new department |
| **PUT** | `/api/departments/:id` | Update department information |
| **DELETE** | `/api/departments/:id` | Delete (Only if no active employees) |

---

## Role Endpoints
Define and assign job roles within the organization.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/roles` | List all roles (Cached) |
| **GET** | `/api/roles/:id` | Get role with linked employees |
| **POST** | `/api/roles` | Create a new role |
| **PUT** | `/api/roles/:id` | Update role details |
| **DELETE** | `/api/roles/:id` | Delete (Only if no employees assigned) |

---

## Attendance Endpoints
Track daily check-ins, check-outs, and leave requests.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/attendance` | List records with date range filter |
| **GET** | `/api/attendance/employee/:id` | Get records for a specific employee |
| **POST** | `/api/attendance/check-in` | Mark check-in for today |
| **POST** | `/api/attendance/check-out` | Mark check-out and compute total hours |
| **POST** | `/api/attendance/leave` | Submit a new leave request |
| **PUT** | `/api/attendance/leave/:id` | Approve or reject a leave request |

# Employee Management System API

A robust RESTful API for organizational management, featuring JWT authentication, automated attendance tracking, and high-performance caching via Redis.

---

## 🚀 Features

* **Cache-Aside Pattern:** Optimized read/write operations using Redis.
* **Secure Auth:** JWT-based authentication with token blacklisting.
* **Database:** Integrated with Supabase for reliable data persistence.
* **Monitoring:** Visual logs for cache hits (📦) and database queries (💾).

---

## 🛠 Redis Caching Strategy

The application implements a **Cache-Aside** pattern to reduce database load:

1.  **Read Operations:** The system checks the cache first. If a "cache miss" occurs, it queries the database and populates the cache.
2.  **Write Operations:** On Create/Update/Delete, the system updates the database and invalidates/updates relevant cache entries.
3.  **TTL (Time to Live):** 5 minutes for most endpoints.
4.  **Key Schema:** Structured as `entity:type:identifier` (e.g., `employees:single:123`).
5.  **Invalidation:** Updates trigger a purge of all related "list" caches and specific "single" entity caches.

---

## ⚠️ Error Handling

Errors are managed through a centralized system to ensure consistent responses:

* **Custom `AppError` Class:** Handles operational errors (4xx/5xx).
* **Global Handler:** Catches all unhandled exceptions.
* **Environment Awareness:** Detailed stack traces are provided in development but hidden in production.
* **Integration Support:** Specific handlers for Supabase and JWT-related failures.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following:

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | Environment (`development` or `production`) |
| `PORT` | Server port (default: 5000) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | JWT expiration time (e.g., `8h`) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) |

---

## 🧪 Testing

A Postman collection is included in the repository for rapid testing.
1.  Open Postman.
2.  Import `postman_collection.json`.
3.  Configure your environment variables in Postman to match your local setup.

---

## 📄 License

This project is licensed under the **ISC License**.

---

**Author:** Angelo Kannangara