# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Starting the Application

```bash
# Development with auto-reload (recommended)
npm run dev

# Production start
npm start
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check
```

### Database Operations

```bash
# Generate database migrations based on schema changes
npm run db:generate

# Apply pending migrations to database
npm run db:migrate

# Open Drizzle Studio for database management
npm run db:studio
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables (requires DATABASE_URL)
```

## Architecture Overview

### Project Structure

This is a Node.js Express API application using ES modules with a clean MVC architecture:

- **Entry Point**: `src/index.js` → `src/server.js` → `src/app.js`
- **Database**: PostgreSQL with Drizzle ORM using Neon serverless database
- **Authentication**: JWT-based with bcrypt password hashing
- **Logging**: Winston with structured logging
- **Import Aliases**: Uses Node.js subpath imports (e.g., `#config/*`, `#models/*`)

### Directory Structure

```
src/
├── config/          # Database connection, logger configuration
├── controllers/     # Request handlers and business logic
├── middleware/      # Custom Express middleware (currently empty)
├── models/          # Drizzle ORM schema definitions
├── routes/          # Express route definitions
├── services/        # Business logic and data access layer
├── utils/           # Helper functions (JWT, cookies, formatting)
└── validations/     # Zod schema validation
```

### Key Architectural Patterns

**Database Layer**:

- Uses Drizzle ORM with PostgreSQL
- Schema definitions in `src/models/`
- Database connection through Neon serverless in `src/config/database.js`
- Migrations stored in `drizzle/` directory

**Authentication Flow**:

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt (10 rounds)
- User model supports role-based access (`user` role by default)
- Validation layer using Zod schemas

**Error Handling & Logging**:

- Structured logging with Winston
- Request logging via Morgan
- Validation errors formatted for API responses
- Error boundaries in controllers with proper HTTP status codes

### Environment Configuration

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string (Neon serverless)
- `PORT`: Server port (defaults to 3000)
- `NODE_ENV`: Environment mode
- `LOG_LEVEL`: Winston logging level

### API Endpoints

Current implementation includes:

- `GET /` - Basic health check
- `GET /health` - Detailed health status with uptime
- `GET /api/` - API welcome message
- `POST /api/auth/sign-up` - User registration (fully implemented)
- `POST /api/auth/sign-in` - User login (stub)
- `POST /api/auth/sign-out` - User logout (stub)

### Development Notes

**Import Aliases**: The project uses Node.js subpath imports defined in `package.json`. Always use these aliases:

- `#config/*` for configuration files
- `#controllers/*` for controllers
- `#models/*` for database models
- `#services/*` for service layer
- `#utils/*` for utility functions
- `#validations/*` for Zod schemas

**Code Style**:

- ES modules throughout
- ESLint with strict rules (single quotes, semicolons required, 2-space indentation)
- Prettier for consistent formatting
- Async/await patterns preferred

**Database Workflow**:

1. Modify schemas in `src/models/`
2. Generate migrations with `npm run db:generate`
3. Apply migrations with `npm run db:migrate`
4. Use `npm run db:studio` for database inspection

**Security Considerations**:

- Helmet middleware for security headers
- CORS configured
- JWT tokens in HTTP-only cookies
- Password hashing with proper salt rounds
- Input validation with Zod schemas
