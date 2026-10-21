# CampusConnect - Frontend Architecture & Development Guide

CampusConnect Frontend is a responsive single-page application (SPA) built with **React 18**, **Vite**, **React Router v6**, and modern CSS3 design variables.

---

## 1. Design System & University Color Palette

The interface adheres to an institutional university aesthetic:

| Color Name | Hex Code | Purpose |
|---|---|---|
| **Primary Navy** | `#14213D` | Navbar, headers, brand elements, primary authority |
| **Secondary Navy**| `#1F3155` | Secondary headers, hero gradient transitions |
| **Purple Accent** | `#7667E8` | Primary CTAs, active pills, links, icons |
| **White** | `#FFFFFF` | Content cards, dialogs, form input backgrounds |
| **Light Background** | `#F5F7FB` | Main platform canvas background |
| **Main Text** | `#202A3B` | High-contrast body typography |
| **Secondary Text**| `#697386` | Metadata, subtitles, timestamps |
| **Success** | `#21865B` | Confirmed registrations, seats available |
| **Error** | `#D64545` | Validation failures, event full indicators |

---

## 2. Directory Structure

```
frontend/
├── package.json
├── vite.config.js
├── index.html
├── .env.example
├── src/
│   ├── main.jsx
│   ├── App.jsx                 # Route declarations & AuthProvider boundary
│   ├── styles/
│   │   └── index.css           # Custom university design system & utilities
│   ├── services/
│   │   ├── api.js              # Axios instance with JWT interceptor
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   ├── registrationService.js
│   │   ├── adminService.js
│   │   └── contactService.js
│   ├── context/
│   │   └── AuthContext.jsx     # User authentication state & session persistence
│   ├── components/
│   │   ├── Navbar.jsx          # Responsive header with role-aware actions
│   │   ├── Footer.jsx          # Campus contact, sitemap, copyright
│   │   ├── EventCard.jsx       # Event card with category, seats badge, link
│   │   ├── LoadingSpinner.jsx  # Accessible loading state
│   │   ├── ErrorMessage.jsx    # Error alert with retry button
│   │   ├── Modal.jsx           # Reusable dialog with backdrop blur
│   │   ├── ProtectedRoute.jsx  # Route guard for logged-in students
│   │   └── AdminRoute.jsx      # Route guard for administrators only
│   └── pages/
│       ├── Home.jsx            # Landing page with hero, live stats, categories
│       ├── ExploreEvents.jsx   # Search, filters, date picker, paginated grid
│       ├── EventDetails.jsx    # Complete details, registration, cancellation
│       ├── Login.jsx           # Authenticate student or administrator
│       ├── Register.jsx        # Student account creation
│       ├── StudentDashboard.jsx# Personal registration history & profile
│       ├── AdminDashboard.jsx  # Event management CRUD, attendees, metrics
│       ├── About.jsx           # Mission, problems solved, ecosystem
│       ├── Contact.jsx         # Contact form persisting to backend MySQL
│       └── NotFound.jsx        # 404 handler
```

---

## 3. Environment Configuration

Create a `.env` file in `frontend/` matching `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

> **Security Note:** Never store API keys, database credentials, or secrets in `VITE_` variables. All client environment variables are exposed in compiled JavaScript.

---

## 4. Local Development Commands (Ubuntu)

### Install Dependencies:
```bash
cd frontend
npm install
```

### Run Vite Development Server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Production Build:
```bash
npm run build
```
Compiled static assets are placed in the `dist/` directory, ready to be served by Nginx, Apache, or any static hosting platform.
