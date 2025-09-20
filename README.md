# Acquisitions API

A modern Node.js Express API for acquisitions management with authentication, user management, and security features.

[![Lint and Format](https://github.com/sitaramoli/acquisitions/actions/workflows/lint-and-format.yml/badge.svg)](https://github.com/sitaramoli/acquisitions/actions/workflows/lint-and-format.yml)
[![Tests](https://github.com/sitaramoli/acquisitions/actions/workflows/tests.yml/badge.svg)](https://github.com/sitaramoli/acquisitions/actions/workflows/tests.yml)
[![Docker Build](https://github.com/sitaramoli/acquisitions/actions/workflows/docker-build-and-push.yml/badge.svg)](https://github.com/sitaramoli/acquisitions/actions/workflows/docker-build-and-push.yml)

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with secure user management
- **Security First**: Implemented with Helmet, CORS, Arcjet security middleware
- **Database Integration**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Logging**: Structured logging with Winston
- **Testing**: Comprehensive test suite with Jest and Supertest
- **Docker Support**: Multi-stage Docker builds with development and production targets
- **CI/CD**: GitHub Actions workflows for linting, testing, and deployment
- **Code Quality**: ESLint and Prettier for consistent code formatting

## 📋 Prerequisites

- **Node.js** (v20.x or later)
- **npm** (v10.x or later)
- **PostgreSQL** database (or Neon database)
- **Docker** (optional, for containerized deployment)

## 🛠️ Installation

### 1. Clone the repository

```bash
  git clone https://github.com/sitaramoli/acquisitions.git
  cd acquisitions
```

### 2. Install dependencies

```bash
  npm install
```

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
  cp .env.example .env.development
```

Edit `.env.development` with your configuration:

```env
# Server configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Database configuration
DATABASE_URL=postgresql://username:password@localhost:5432/acquisitions_db
```

### 4. Database Setup

Generate and run database migrations:

```bash
# Generate migrations
  npm run db:generate

# Apply migrations
  npm run db:migrate
```

## 🚀 Usage

### Development Mode

Start the development server with hot reload:

```bash
  npm run dev
```

The API will be available at `http://localhost:3000`

### Production Mode

Start the production server:

```bash
  npm start
```

### Using Docker

#### Development with Docker

```bash
# Using the development script
  npm run dev:docker

# Or manually
  chmod +x scripts/dev.sh
  ./scripts/dev.sh
```

#### Production with Docker

```bash
# Using the production script
  npm run prod:docker

# Or manually
  chmod +x scripts/prod.sh
  ./scripts/prod.sh
```

## 📚 API Endpoints

### Health Check

- `GET /` - Welcome message
- `GET /health` - Health status with uptime
- `GET /api/` - API welcome message

### Authentication

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID (authenticated)
- `PUT /api/users/:id` - Update user (authenticated)
- `DELETE /api/users/:id` - Delete user (authenticated)

## 🧪 Testing

### Run Tests

```bash
  # Run all tests
  npm test
  
# Run tests with coverage
  npm test -- --coverage
```

### Test Environment

Tests run with the following environment variables:
- `NODE_ENV=test`
- `NODE_OPTIONS=--experimental-vm-modules`
- `DATABASE_URL` (configured for test database)

## 🔧 Development Tools

### Code Quality

```bash
  # Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Database Tools

```bash
  # Generate schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

## 🏗️ Project Structure

```
acquisitions/
├── .github/workflows/     # GitHub Actions CI/CD
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/          # Database models (Drizzle)
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validations/     # Input validation schemas
│   ├── app.js           # Express app configuration
│   ├── index.js         # Application entry point
│   └── server.js        # Server startup
├── tests/               # Test files
├── scripts/             # Deployment scripts
├── coverage/            # Test coverage reports
├── drizzle/             # Database migrations
├── Dockerfile           # Multi-stage Docker build
├── drizzle.config.js    # Drizzle ORM configuration
├── eslint.config.js     # ESLint configuration
├── jest.config.mjs      # Jest test configuration
└── package.json         # Project dependencies
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Arcjet**: Advanced security middleware
- **JWT**: JSON Web Token authentication
- **bcrypt**: Password hashing
- **Input Validation**: Zod schema validation

## 🐳 Docker

### Multi-stage Build

The project includes a multi-stage Dockerfile with:
- **Base stage**: Common setup and production dependencies
- **Development stage**: Development dependencies and watch mode
- **Production stage**: Optimized for production deployment

### Images

- **Development**: Includes dev dependencies, runs with `npm run dev`
- **Production**: Optimized image, runs with `npm start`
- **Health checks**: Built-in health check endpoint

## 🚀 Deployment

### GitHub Actions

The project includes three CI/CD workflows:

1. **Lint and Format** (`lint-and-format.yml`):
   - Runs ESLint and Prettier checks
   - Triggered on pushes and PRs to `main` and `staging`

2. **Tests** (`tests.yml`):
   - Runs the test suite with coverage
   - Uploads coverage artifacts
   - Triggered on pushes and PRs to `main` and `staging`

3. **Docker Build and Push** (`docker-build-and-push.yml`):
   - Builds multi-platform Docker images
   - Pushes to Docker Hub
   - Triggered on pushes to `main` or manual dispatch

### Required Secrets

Configure these secrets in your GitHub repository:

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password/token
- `DATABASE_URL` - Production database URL

### Manual Deployment

1. **Build Docker image**:
```bash
   docker build --target production -t acquisitions:latest .
   ```

2. **Run container**:
```bash
   docker run -p 3000:3000 --env-file .env.production acquisitions:latest
   ```

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `3000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `LOG_LEVEL` | Logging level | No | `info` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the ESLint configuration
- Use Prettier for code formatting
- Write tests for new features
- Maintain test coverage above 80%

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**S.R. Oli**

- GitHub: [@sitaramoli](https://github.com/sitaramoli)

## 🐛 Issues

Found a bug? Please file an issue at [GitHub Issues](https://github.com/sitaramoli/acquisitions/issues).

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

## 📖 Additional Documentation

- [Docker Setup Guide](DOCKER.md)
- [Development with Warp Terminal](WARP.md)

---

**Happy coding!** 🎉