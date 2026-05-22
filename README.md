# DevPulse

A modern issue tracking and management system built with TypeScript, Express.js, and PostgreSQL.

## Live URL

(To be added)

---

## Features

### Authentication & Authorization
- User registration and login with secure password hashing (bcrypt)
- JWT-based authentication for protected routes
- Role-based access control (Contributor, Maintainer)

### Issue Management
- Create, read, update, and delete issues
- Issue categorization (Bug, Feature Request)
- Issue status tracking (Open, In Progress, Resolved)
- Role-based permissions:
  - **Contributors**: Can create issues and update their own open issues
  - **Maintainers**: Can manage all issues
- Advanced sorting (newest/oldest)

---

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Environment Management**: dotenv

### Development Tools
- **Package Manager**: npm
- **Development Server**: tsx (TypeScript executor)
- **Type Definitions**: TypeScript types for Express, pg, bcrypt, JWT

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd A2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DB_STRING=postgresql://username:password@localhost:5432/devpulse
   SECRET=your_jwt_secret_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` and automatically initialize the database schema.

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/login` | Login user | No |

#### Signup Request
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "contributor"
}
```

#### Login Request
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

---

### Issues Routes
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|----------------|------|
| POST | `/issues` | Create a new issue | Yes | Contributor+ |
| GET | `/issues` | Get all issues (with sorting) | No | - |
| GET | `/issues/:id` | Get a specific issue | No | - |
| PATCH | `/issues/:id` | Update an issue | Yes | Contributor+ |
| DELETE | `/issues/:id` | Delete an issue | Yes | Maintainer |

#### Create Issue Request
```json
{
  "title": "Bug: Login page not responsive",
  "description": "The login page doesn't display properly on mobile devices",
  "type": "bug",
  "status": "open"
}
```

#### Get All Issues (Sorting)
```
GET /issues?sort=newest    # Default (sorted by creation date DESC)
GET /issues?sort=oldest    # Sorted by creation date ASC
```

#### Update Issue Request
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "type": "feature_request"
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(25) NOT NULL DEFAULT 'contributor' 
    CHECK (role IN ('contributor', 'maintainer')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Issues Table
```sql
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL 
    CHECK (type IN ('bug', 'feature_request')),
  status VARCHAR(50) NOT NULL DEFAULT 'open' 
    CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Database Relationships
- `issues.reporter_id` → `users.id` (User who reported the issue)

---

## Project Structure

```
src/
├── server.ts                 # Entry point
├── app.ts                    # Express app configuration
├── Config/
│   └── config.ts            # Environment configuration
├── DB/
│   └── database.ts          # PostgreSQL connection & schema
├── Middleware/
│   ├── index.ts             # Middleware exports
│   └── authMiddle.ts        # JWT authentication middleware
├── Modules/
│   ├── Auth/
│   │   ├── auth.routes.ts   # Authentication routes
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── user.interface.ts
│   └── Issues/
│       ├── issues.routes.ts # Issue management routes
│       ├── issues.controller.ts
│       ├── issues.service.ts
│       └── issues.interface.ts
└── Utils/
    └── res.ts               # Response formatting utilities
```

---

## Authentication

### JWT Token
After login, the API returns a JWT token in the response. Include it in subsequent requests:

```bash
Authorization: <jwt_token>
```

### Token Payload
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "contributor",
  "iat": 1234567890
}
```

---

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "error": {}
}
```

---

## Running the Project

### Development
```bash
npm run dev
```

### Test
```bash
npm test
```

---

## Future Enhancements

- Add comment/discussion feature on issues
- Implement issue filtering by status and type
- Add pagination for large result sets
- Create admin dashboard
- Implement email notifications
- Add rate limiting
- Create API documentation with Swagger

---

## License

ISC

---

## Support

For issues or questions, please create an issue in the repository.
