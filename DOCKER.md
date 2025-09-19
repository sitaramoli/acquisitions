# Docker Setup for Acquisitions App

This document provides comprehensive instructions for running the Acquisitions application using Docker with both development (Neon Local) and production (Neon Cloud) configurations.

## Overview

The application is dockerized to support two distinct environments:

- **Development**: Uses Neon Local proxy for ephemeral database branches
- **Production**: Uses Neon Cloud database directly

## Prerequisites

- Docker and Docker Compose installed
- Neon account and project set up at [console.neon.tech](https://console.neon.tech/)
- Node.js 20+ (for local development without Docker)

## Quick Start

### Development Environment

1. **Configure Neon credentials**:

   ```bash
   cp .env.example .env.development
   ```

   Edit `.env.development` and add your Neon credentials:

   ```bash
   # Get these from your Neon Console: https://console.neon.tech/
   NEON_API_KEY=your_neon_api_key_here
   NEON_PROJECT_ID=your_neon_project_id_here
   PARENT_BRANCH_ID=your_parent_branch_id_here
   ```

2. **Start development environment**:

   ```bash
   ./scripts/dev.sh
   ```

   Or manually:

   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Access the application**:
   - App: http://localhost:3000
   - Neon Local database: localhost:5432

### Production Environment

1. **Configure production settings**:

   ```bash
   cp .env.example .env.production
   ```

   Edit `.env.production` with your production values:

   ```bash
   DATABASE_URL=postgres://username:password@ep-example-123456.us-east-1.aws.neon.tech/dbname?sslmode=require
   JWT_SECRET=your_secure_jwt_secret_here
   ```

2. **Start production environment**:

   ```bash
   ./scripts/prod.sh
   ```

   Or manually:

   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

3. **Access the application**:
   - App: http://localhost:3000

## Architecture

### Development Setup

```
┌─────────────────┐    ┌──────────────────┐
│   Your App      │────│   Neon Local     │
│  (port 3000)    │    │   (port 5432)    │
└─────────────────┘    └──────────────────┘
                                │
                                │ API calls
                                ▼
                       ┌──────────────────┐
                       │   Neon Cloud     │
                       │  (your project)  │
                       └──────────────────┘
```

**How it works**:

- Neon Local creates ephemeral database branches automatically
- Each `docker-compose up` creates a fresh branch
- Branch is deleted when containers stop
- No manual cleanup required

### Production Setup

```
┌─────────────────┐
│   Your App      │────────────────────────┐
│  (port 3000)    │                        │
└─────────────────┘                        │
                                           │ Direct connection
                                           ▼
                                  ┌──────────────────┐
                                  │   Neon Cloud     │
                                  │  (your project)  │
                                  └──────────────────┘
```

**How it works**:

- Direct connection to your Neon Cloud database
- No Neon Local proxy
- Production-optimized Docker configuration

## Configuration Details

### Environment Variables

| Variable           | Development                                               | Production          | Description                              |
| ------------------ | --------------------------------------------------------- | ------------------- | ---------------------------------------- |
| `DATABASE_URL`     | `postgres://neondb_owner:password@neon-local:5432/neondb` | Your Neon Cloud URL | Database connection string               |
| `NEON_API_KEY`     | Required                                                  | Not used            | Neon API key from console                |
| `NEON_PROJECT_ID`  | Required                                                  | Not used            | Your Neon project ID                     |
| `PARENT_BRANCH_ID` | Required                                                  | Not used            | Branch to create ephemeral branches from |
| `JWT_SECRET`       | Dev value                                                 | Secure secret       | JWT signing secret                       |
| `NODE_ENV`         | `development`                                             | `production`        | Environment mode                         |
| `LOG_LEVEL`        | `debug`                                                   | `warn`              | Logging verbosity                        |

### Getting Neon Credentials

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. **API Key**: Go to Account Settings → API Keys → Create new key
4. **Project ID**: Found in project settings or URL
5. **Parent Branch ID**: Usually your `main` branch ID (found in Branches tab)

## Docker Commands Reference

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Start in background
docker-compose -f docker-compose.dev.yml up --build -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop and remove containers
docker-compose -f docker-compose.dev.yml down

# Stop and remove containers + volumes
docker-compose -f docker-compose.dev.yml down -v

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Production Commands

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f app

# Check container status
docker-compose -f docker-compose.prod.yml ps

# Stop production environment
docker-compose -f docker-compose.prod.yml down

# Scale application (if needed)
docker-compose -f docker-compose.prod.yml up --scale app=3 -d
```

### Database Operations

```bash
# Run migrations (development)
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Generate migrations (development)
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Open Drizzle Studio (development)
docker-compose -f docker-compose.dev.yml exec app npm run db:studio

# Run migrations (production)
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

## Troubleshooting

### Common Issues

1. **Environment variables not being passed**:

   ```bash
   # Test environment variables are being loaded
   ./scripts/test-env.sh

   # Check if .env.development exists and has correct values
   cat .env.development

   # Manually test environment in container
   docker-compose -f docker-compose.dev.yml run --rm app env | grep DATABASE_URL
   ```

2. **Neon Local not starting**:

   ```bash
   # Check if credentials are correct
   docker-compose -f docker-compose.dev.yml logs neon-local

   # Verify environment variables are loaded
   docker-compose -f docker-compose.dev.yml exec app env | grep NEON
   ```

3. **Database connection failed**:

   ```bash
   # Test connection to Neon Local
   docker-compose -f docker-compose.dev.yml exec app nc -z neon-local 5432

   # Check database logs
   docker-compose -f docker-compose.dev.yml logs neon-local
   ```

4. **App not starting**:

   ```bash
   # Check application logs
   docker-compose -f docker-compose.dev.yml logs app

   # Rebuild containers
   docker-compose -f docker-compose.dev.yml up --build --force-recreate
   ```

5. **Port already in use**:

   ```bash
   # Find process using port 3000
   lsof -i :3000

   # Kill process or change port in compose file
   ```

### Health Checks

The production container includes health checks:

```bash
# Check container health
docker-compose -f docker-compose.prod.yml ps

# Manual health check
curl http://localhost:3000/health
```

## File Structure

```
acquisitions/
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.dev.yml     # Development with Neon Local
├── docker-compose.prod.yml    # Production with Neon Cloud
├── .dockerignore             # Docker build context exclusions
├── .env.development          # Development environment variables
├── .env.production           # Production environment variables
├── .env.example              # Environment template
├── scripts/
│   ├── dev.sh               # Development startup script
│   └── prod.sh              # Production startup script
└── src/
    └── config/
        └── database.js       # Database configuration
```

## Best Practices

### Development

- Use ephemeral branches for isolated testing
- Mount source code for hot reload
- Use debug logging level
- Keep Neon Local running during development sessions

### Production

- Use secure, randomly generated JWT secrets
- Set appropriate resource limits
- Use read-only filesystem where possible
- Monitor container health and logs
- Use HTTPS in production deployments

### Security

- Never commit `.env.*` files to version control
- Rotate JWT secrets regularly
- Use Neon's connection pooling features
- Enable SSL for database connections in production
- Regularly update base Docker images

## Next Steps

1. **Set up CI/CD**: Integrate with GitHub Actions or similar
2. **Add monitoring**: Consider adding Prometheus/Grafana
3. **Load balancing**: Use nginx for production load balancing
4. **Database backups**: Set up automated Neon backups
5. **Secrets management**: Use Docker secrets or external vault

For more information about Neon Local, visit: https://neon.com/docs/local/neon-local
