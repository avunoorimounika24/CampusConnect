# CampusConnect - Complete Full-Stack College Event Management Platform

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

CampusConnect is a production-minded, full-stack college event management platform that connects university students, department clubs, academic coordinators, and campus administrators. The platform streamlines collegiate event discovery, enforces concurrency-safe participant registrations, and provides administrators with comprehensive event lifecycle and attendee management.

---

## 1. Project Overview

Campus life thrives on hackathons, seminars, cultural fests, workshops, and sports tournaments. However, university administrations often struggle with fragmented noticeboards, lab overbooking, duplicate paper registrations, and messy spreadsheets.

CampusConnect solves this by delivering:
- A single source of truth for all campus events.
- Concurrency-safe student registrations that strictly enforce capacity limits.
- Role-based security (Spring Security 6 with stateless JWT authentication).
- Real-time seat inventory and registration history tracking.
- An institutional university design system matching collegiate branding standards.

---

## 2. Features

### For Students:
- **Event Discovery**: Search by keywords, filter by category (Technical, Hackathons, Cultural, Sports, Workshops, Seminars, Entrepreneurship, Other), filter by date and status.
- **Detailed Specifications**: View event banner, schedule, venue, organizer, capacity, and remaining seats.
- **One-Click Registration**: Secure enrollment validated by backend capacity checks and deadline rules.
- **Registration Cancellation**: Self-service seat release when scheduling conflicts arise.
- **Personalized Dashboard**: View registration history, upcoming events, and student profile.

### For Administrators:
- **Executive Analytics**: Real-time stats on total events, upcoming activities, total registrations, and student engagement.
- **Event Management**: Create, edit, publish, reschedule, and delete events.
- **Status Lifecycle Control**: Toggle events between `ACTIVE`, `DRAFT`, `COMPLETED`, and `CANCELLED`.
- **Attendee Roster**: Inspect real-time lists of enrolled students with Student ID, department, year, and email.
- **Inquiry Handling**: Review contact inquiries submitted directly to the database.

---

## 3. Screenshots

> **Instructions for Adding Screenshots:** Place application screenshots in a `docs/screenshots/` directory and reference them here.

| Page | Preview |
|---|---|
| **Landing Page** | `docs/screenshots/home.png` (Hero section, live platform statistics, spotlight events) |
| **Event Catalog** | `docs/screenshots/events.png` (Search bar, category filters, responsive cards) |
| **Event Details** | `docs/screenshots/event-details.png` (Logistics, capacity progress, register action) |
| **Student Dashboard** | `docs/screenshots/student-dashboard.png` (Enrolled events, cancellation, profile) |
| **Admin Dashboard** | `docs/screenshots/admin-dashboard.png` (Metrics, event table, attendee roster) |

---

## 4. Technology Stack

### Frontend:
- **Framework**: React 18 (SPA)
- **Tooling**: Vite 5
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT interceptors
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans & Space Grotesk
- **Styling**: Pure CSS3 Institutional Design System (Responsive CSS Variables)

### Backend:
- **Language**: Java 21 (LTS)
- **Framework**: Spring Boot 3.3.4
- **Security**: Spring Security 6, BCrypt, JWT (`jjwt` 0.12.6)
- **Persistence**: Spring Data JPA / Hibernate 6
- **Database**: MySQL 8.0+
- **Validation**: Jakarta Bean Validation (`@Valid`, `@FutureOrPresent`, `@NotBlank`)
- **Testing**: JUnit 5, Mockito, Spring Boot Test, H2 In-Memory DB

---

## 5. Architecture Overview

CampusConnect follows a decoupled client-server architecture:

```
[ React 18 SPA (Vite) ]
       │
       │ HTTP / JSON (REST APIs with JWT Bearer Token)
       ▼
[ Spring Security 6 Filter Chain (JwtAuthenticationFilter) ]
       │
       ▼
[ Spring Boot Controllers (REST Endpoints) ]
       │
       ▼
[ Service Layer (Business Logic & Pessimistic Locking) ]
       │
       ▼
[ Spring Data JPA Repositories ]
       │
       ▼
[ MySQL 8+ Database (Persistent Storage) ]
```

---

## 6. Project Folder Structure

```
campusconnect/
├── backend/
│   ├── src/main/java/com/campusconnect/
│   │   ├── config/          # SecurityConfig, CorsConfig, DataSeeder
│   │   ├── controller/      # Auth, Event, Registration, Admin, Contact, Stats
│   │   ├── dto/             # Strongly typed Request and Response DTOs
│   │   ├── entity/          # User, Event, EventRegistration, ContactMessage
│   │   ├── exception/       # GlobalExceptionHandler, Custom exceptions
│   │   ├── repository/      # Spring Data JPA Repositories with locks
│   │   ├── security/        # JwtService, JwtAuthenticationFilter, UserDetails
│   │   ├── service/         # Business services enforcing constraints
│   │   └── CampusConnectApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── src/test/            # 25 Unit and Integration Tests
│   ├── pom.xml
│   ├── Dockerfile
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, EventCard, Modal, Spinners
│   │   ├── context/         # AuthContext (JWT session state)
│   │   ├── pages/           # 8 Core Application Pages + NotFound
│   │   ├── services/        # Axios API client modules
│   │   ├── styles/          # index.css (University design system)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── README.md
├── docker-compose.yml       # Complete multi-container orchestration
├── schema.sql               # Full DDL database initialization script
├── .env.example             # Master environment variable template
├── .gitignore
└── README.md
```

---

## 7. Prerequisites (Ubuntu Linux)

Install the required runtimes and tools on Ubuntu 20.04 / 22.04 / 24.04:

```bash
# Update package repositories
sudo apt update

# Install Java 21 JDK
sudo apt install -y openjdk-21-jdk

# Install Apache Maven
sudo apt install -y maven

# Install Node.js (v20+) and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL Server (if not already installed)
sudo apt install -y mysql-server
```

Verify installed versions:
```bash
java -version    # OpenJDK 21
mvn -version     # Apache Maven 3.6+
node -v          # v20+
npm -v           # v10+
mysql --version  # Ver 8.0+
```

---

## 8. MySQL Database Setup

### Step 1: Start MySQL Service
```bash
sudo service mysql start
```

### Step 2: Create Database and User
Log into MySQL:
```bash
sudo mysql
```

Execute SQL commands:
```sql
CREATE DATABASE IF NOT EXISTS campusconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create application user (or configure root credentials)
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'Mounika@1324';
GRANT ALL PRIVILEGES ON campusconnect.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Run Schema Initialization (Optional - Spring Boot auto-creates)
```bash
mysql -u root -p'Mounika@1324' campusconnect < schema.sql
```

---

## 9. Environment Configuration

Create a `.env` file in the root directory or configure individual submodules:

```bash
cp .env.example .env
```

Default variables used:
```env
DATABASE_HOST=localhost
DATABASE_PORT=3307
DATABASE_NAME=campusconnect
DATABASE_USERNAME=root
DATABASE_PASSWORD=Mounika@1324
JWT_SECRET=4c616d707573436f6e6e6563745365637572654a57545365637265744b6579323032362140232425
ADMIN_INITIAL_EMAIL=admin@campusconnect.edu
ADMIN_INITIAL_PASSWORD=Admin@12345
```

---

## 10. Backend Startup (Ubuntu)

```bash
cd /home/rgukt-basar/Downloads/campusconnect/backend

# Configure Java 21 environment
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Build executable JAR
mvn clean package -DskipTests

# Start the Spring Boot application
java -jar target/campusconnect-backend-1.0.0.jar
```
*The backend server will start on `http://localhost:8080`.*

---

## 11. Frontend Startup (Ubuntu)

Open a new terminal window:
```bash
cd /home/rgukt-basar/Downloads/campusconnect/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
*Open your browser and navigate to `http://localhost:5173`.*

---

## 12. Default Demo Accounts

The application automatically seeds an initial administrator and a demo student on first launch:

| Role | Email | Password | Student ID / Department |
|---|---|---|---|
| **Administrator** | `admin@campusconnect.edu` | `Admin@12345` | Campus Administration |
| **Student** | `student@rgukt.ac.in` | `Student@1234` | `B200001` - Computer Science |

---

## 13. REST API Endpoint Summary

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student profile |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |

### Events (`/api/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | Paginated event catalog with search & filter |
| `GET` | `/api/events/{id}` | Public | Event details by database ID |
| `GET` | `/api/events/featured` | Public | Top featured upcoming events |
| `GET` | `/api/events/categories` | Public | List of available event categories |

### Public Platform Statistics (`/api/stats`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/stats` | Public | Total events, registrations, students |

### Student Registrations (`/api/registrations`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/registrations/events/{id}`| Authenticated | Register student for event (locked) |
| `GET` | `/api/registrations/my` | Authenticated | View logged-in student's registrations |
| `GET` | `/api/registrations/my/{id}` | Authenticated | View specific registration details |
| `DELETE`| `/api/registrations/{id}` | Authenticated | Cancel active registration |

### Admin Operations (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard/stats` | Admin Only | Full system metrics & recent signups |
| `GET` | `/api/admin/events` | Admin Only | Manage all events (any status) |
| `POST` | `/api/admin/events` | Admin Only | Create new event |
| `PUT` | `/api/admin/events/{id}` | Admin Only | Update existing event |
| `DELETE`| `/api/admin/events/{id}` | Admin Only | Delete event and cleanup registrations |
| `PATCH`| `/api/admin/events/{id}/status`| Admin Only | Toggle status (ACTIVE/CANCELLED) |
| `GET` | `/api/admin/events/{id}/registrations` | Admin Only | View enrolled student roster |
| `GET` | `/api/admin/registrations` | Admin Only | View all registrations |

### Inquiries & Contact (`/api/contact`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public | Submit message to database |
| `GET` | `/api/contact/messages` | Admin Only | Review student inquiries |

---

## 14. Authentication & Authorization Explanation

1. **Client Request**: The client sends credentials via `POST /api/auth/login`.
2. **Authentication**: `AuthenticationManager` verifies the email and validates the BCrypt password hash.
3. **Token Generation**: `JwtService` signs an HMAC-SHA256 token containing claims (`userId`, `role`, `name`, `sub`).
4. **Stateless Request**: The client includes the token in HTTP headers:
   `Authorization: Bearer <token>`
5. **Security Filter**: `JwtAuthenticationFilter` intercepts each request, parses and verifies the token signature and expiration, loading authorities into `SecurityContextHolder`.
6. **Method Security**: Controllers enforce `@PreAuthorize("hasRole('ADMIN')")`. Students attempting to access administrative endpoints are rejected with `HTTP 403 Forbidden`.

---

## 15. Testing Instructions

The project includes 25 unit and integration tests covering business rules, validations, and security:

```bash
cd backend
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

mvn test
```

### Verified Test Cases:
- Student Registration & BCrypt hashing
- Duplicate email prevention
- Duplicate student ID prevention
- Password mismatch rejection
- Successful login & JWT generation
- Invalid login credentials handling
- Public paginated event search & filtering
- Event details retrieval
- Event not found (404) exception
- Pessimistic lock capacity enforcement
- Duplicate registration prevention
- Registration deadline validation
- Student registration privacy enforcement
- Self-service registration cancellation
- Event creation by authorized administrator
- Event creation time & deadline validation
- Admin dashboard metrics calculation
- Authorization verification: Admin authorized (201 Created)
- Security verification: Student rejected from admin endpoints (403 Forbidden)
- Unauthenticated user rejected from admin endpoints (403 Forbidden)
- Contact form submission to MySQL
- Contact form invalid email format rejection
- Contact form missing required fields rejection

---

## 16. Troubleshooting

### Port Conflicts (Port 8080 or 5173 already in use):
```bash
# Check what process is using port 8080
sudo lsof -i :8080
# Check what process is using port 3307
sudo lsof -i :3307
```
You can change the backend port by setting `SERVER_PORT=8081` in environment variables.

### MySQL Connection Refused:
Ensure MySQL is running and listening on the designated port:
```bash
sudo service mysql status
# Test connection with mysql client
mysql -h 127.0.0.1 -P 3307 -u root -p'Mounika@1324'
```

---

## 17. Production Deployment Guide

### Deploying with Docker Compose:
```bash
docker compose up -d --build
```
This launches the MySQL 8 database container, Spring Boot 3 backend container, and Nginx-hosted React frontend container connected on a secure internal bridge network.

### Independent Cloud Deployment:
1. **Database**: Provision a managed MySQL instance (AWS RDS, DigitalOcean Managed Database, or Railway MySQL).
2. **Backend**: Deploy the JAR file to AWS Elastic Beanstalk, Render, DigitalOcean App Platform, or a Linux VPS (Ubuntu with Systemd service).
   - Configure environment variables: `DATABASE_HOST`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`.
3. **Frontend**: Build production assets with `npm run build` and deploy `dist/` to Vercel, Netlify, Cloudflare Pages, or AWS S3 + CloudFront.
   - Configure frontend environment variable: `VITE_API_BASE_URL=https://api.yourdomain.edu/api`.
4. **HTTPS / SSL**: Install free Let's Encrypt certificates using Certbot for secure HTTPS communication.

---

## 18. Security Notes

- **Secret Management**: Passwords and JWT secret keys are never committed in plain text; use environment variables in production.
- **SQL Injection Prevention**: All database queries use Hibernate JPA prepared statements and parameterized bindings.
- **XSS & CSRF**: Stateless token authentication eliminates CSRF vulnerabilities. Modern React JSX escapes output to prevent cross-site scripting.
- **Data Protection**: Sensitive password hashes are explicitly omitted from all response DTOs.

---

## 19. Known Limitations

- **Email Service**: Contact inquiries are persisted in the database; email sending via SMTP requires configuring `spring-boot-starter-mail` credentials with a dedicated SMTP provider (e.g. Amazon SES, SendGrid).
- **File Uploads**: Image banners currently accept HTTPS image URLs. Direct file uploads can be extended using AWS S3 or a local multipart storage volume.

---

## 20. Future Improvements

- QR Code generation for event ticket verification at venue entrances.
- Automated email and SMS notifications prior to event commencement.
- Attendance check-in scanner for club coordinators.
- Student certificate generation for completed workshops.
