# CampusConnect - Backend Architecture & Development Guide

CampusConnect Backend is a production-grade, secure RESTful API built with **Spring Boot 3.3.4**, **Java 21**, **Spring Security 6**, and **MySQL 8+**.

---

## 1. Architecture Overview

The backend uses a layered architecture strictly separating concerns:

```
backend/
├── pom.xml
├── src/main/java/com/campusconnect/
│   ├── CampusConnectApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java         # Stateless JWT filter chain & endpoints authorization
│   │   ├── CorsConfig.java             # Cross-Origin resource sharing policy
│   │   └── DataSeeder.java             # Controlled initial seeding of admin & demo data
│   ├── controller/
│   │   ├── AuthController.java         # Register, Login, Me endpoints
│   │   ├── EventController.java        # Public event discovery, categories, search
│   │   ├── RegistrationController.java # Student registration & cancellation
│   │   ├── AdminController.java        # Administrator event CRUD & attendees
│   │   ├── ContactController.java      # Inquiry submissions & review
│   │   └── StatsController.java        # Public homepage live platform stats
│   ├── service/
│   │   ├── AuthService.java            # User credentials, JWT issuance, BCrypt hashing
│   │   ├── EventService.java           # Dynamic search, category filtering, capacity mapping
│   │   ├── RegistrationService.java    # Pessimistic locking, capacity & deadline enforcement
│   │   ├── AdminService.java           # Statistical analytics, event lifecycle management
│   │   └── ContactService.java         # Contact message handling
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── EventRepository.java        # Pessimistic write lock queries
│   │   ├── EventRegistrationRepository.java
│   │   └── ContactMessageRepository.java
│   ├── entity/
│   │   ├── User.java                   # User entity with ROLE_STUDENT / ROLE_ADMIN
│   │   ├── Event.java                  # Event entity with dates, times, capacity
│   │   ├── EventRegistration.java      # Registration relationship with unique constraint
│   │   └── ContactMessage.java         # Persisted campus inquiries
│   ├── dto/
│   │   ├── request/                    # Strongly validated Bean Validation request DTOs
│   │   └── response/                   # Secure response DTOs (omitting password hashes)
│   ├── security/
│   │   ├── JwtService.java             # JJWT 0.12.6 HMAC-SHA256 signing and validation
│   │   ├── JwtAuthenticationFilter.java# Per-request Authorization Bearer extraction
│   │   └── CustomUserDetailsService.java
│   └── exception/
│       ├── GlobalExceptionHandler.java # Uniform JSON error formatting across all exceptions
│       ├── ResourceNotFoundException.java
│       ├── DuplicateResourceException.java
│       ├── EventFullException.java
│       └── RegistrationClosedException.java
```

---

## 2. Security & Concurrency Design

### Authentication & Authorization
- **BCrypt Password Hashing**: Passwords are never stored in plaintext. Passwords are salted and hashed using BCrypt.
- **JWT (JSON Web Tokens)**: Stateless authentication via `Authorization: Bearer <token>`.
- **Role Enforcement**:
  - `ROLE_STUDENT`: Permitted to discover events, register for events, view/cancel own registrations.
  - `ROLE_ADMIN`: Permitted full CRUD over events, attendee listings, and platform metrics.
  - Student registration endpoint enforces `ROLE_STUDENT` only. Self-registration as `ROLE_ADMIN` is strictly forbidden.
- **Student Privacy**: All registration queries verify identity against the authenticated security context. Students can never view or modify another student's registrations.

### Concurrency & Capacity Protection
When students register for events, race conditions are prevented using **pessimistic locking** (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) in `RegistrationService`. The event row is locked within a `@Transactional` boundary while capacity is evaluated, guaranteeing that capacity limits can never be exceeded by concurrent requests.

---

## 3. Prerequisites (Ubuntu Linux)

- **Java 21**: OpenJDK 21
  ```bash
  sudo apt update
  sudo apt install openjdk-21-jdk
  ```
- **Maven**: 3.6+
  ```bash
  sudo apt install maven
  ```
- **MySQL 8+**:
  ```bash
  sudo apt install mysql-server
  ```

---

## 4. Configuration & Environment Variables

Configuration is loaded from environment variables with sensible local defaults in `src/main/resources/application.yml`:

| Variable | Default Value | Description |
|---|---|---|
| `DATABASE_HOST` | `localhost` | MySQL server hostname or IP |
| `DATABASE_PORT` | `3307` | MySQL server port |
| `DATABASE_NAME` | `campusconnect` | MySQL database name |
| `DATABASE_USERNAME` | `root` | MySQL user |
| `DATABASE_PASSWORD` | `Mounika@1324` | MySQL password |
| `JWT_SECRET` | `4c616d...` | 256-bit HMAC-SHA secret key |
| `JWT_EXPIRATION_MS` | `86400000` | 24 hours (in milliseconds) |
| `ADMIN_INITIAL_EMAIL` | `admin@campusconnect.edu` | Initial administrator login |
| `ADMIN_INITIAL_PASSWORD` | `Admin@12345` | Initial administrator password |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,...` | Whitelisted frontend origins |

---

## 5. Running the Backend Locally

### Run with Maven:
```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

cd backend
mvn spring-boot:run
```

### Run Executable JAR:
```bash
cd backend
mvn clean package -DskipTests
java -jar target/campusconnect-backend-1.0.0.jar
```

---

## 6. Running Tests

Execute all 25 unit and integration tests (including security and constraint validations):
```bash
cd backend
mvn test
```
The test suite utilizes an in-memory H2 database in MySQL compatibility mode (`@ActiveProfiles("test")`), ensuring isolated, reproducible test runs without mutating development data.
