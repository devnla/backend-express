# Bipoliate Backend API

A robust backend API built with Express.js, TypeScript, and dual database support (MongoDB/PostgreSQL). Features JWT authentication, OpenAPI documentation, comprehensive error handling, and logging.

## Features

- **Express.js** with TypeScript for type safety
- **Dual Database Support**: MongoDB (Mongoose) and PostgreSQL (TypeORM)
- **JWT Authentication** with bcrypt password hashing
- **OpenAPI/Swagger Documentation** for API endpoints
- **Comprehensive Error Handling** with custom error classes
- **Winston Logging** with file and console outputs
- **Input Validation** using Joi schemas
- **Security Middleware**: Helmet, CORS, Rate Limiting
- **Docker Support** with multi-stage builds
- **Testing Setup** with Jest and TypeScript
- **Code Quality**: ESLint with TypeScript rules

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- MongoDB or PostgreSQL (or both)
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bipoliate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

### Using Docker

1. Start all services:
```bash
docker-compose up -d
```

2. View logs:
```bash
docker-compose logs -f app
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_DRIVER` | Database type (`mongodb` or `postgresql`) | `mongodb` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/bipoliate` |
| `POSTGRES_HOST` | PostgreSQL host | `localhost` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `POSTGRES_USERNAME` | PostgreSQL username | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `password` |
| `POSTGRES_DATABASE` | PostgreSQL database | `bipoliate` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `LOG_LEVEL` | Logging level | `info` |
| `LOG_FILE` | Log file path | `logs/app.log` |

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users

- `GET /api/users/profile` - Get user profile (protected)

## Database Configuration

The application supports both MongoDB and PostgreSQL. Set the `DATABASE_DRIVER` environment variable to choose:

### MongoDB Setup
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongo mongo:7

# Or install locally
# Follow MongoDB installation guide
```

### PostgreSQL Setup
```bash
# Using Docker
docker run -d -p 5432:5432 --name postgres \
  -e POSTGRES_DB=bipoliate \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  postgres:16

# Or install locally
# Follow PostgreSQL installation guide
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Structure

```
src/
├── config/          # Configuration files
│   ├── database.ts   # Database connections
│   └── swagger.ts    # OpenAPI configuration
├── entities/         # Database entities/models
│   └── User.ts       # User entity for both databases
├── middleware/       # Express middleware
│   ├── auth.ts       # JWT authentication
│   ├── errorHandler.ts # Error handling
│   └── validation.ts # Input validation
├── routes/           # API routes
│   ├── auth.ts       # Authentication routes
│   └── users.ts      # User routes
├── services/         # Business logic
│   └── authService.ts # Authentication service
├── utils/            # Utility functions
│   └── logger.ts     # Winston logger
└── index.ts          # Application entry point
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **JWT**: Secure authentication
- **bcrypt**: Password hashing
- **Input Validation**: Joi schemas
- **Error Handling**: No sensitive data exposure

## Logging

The application uses Winston for logging with multiple transports:
- Console output (development)
- File logging (`logs/app.log`)
- Error-specific logging (`logs/error.log`)

## Testing

Run tests with:
```bash
npm test
```

Generate coverage report:
```bash
npm test -- --coverage
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Start the server:
```bash
npm start
```

### Docker Production

```bash
docker build -t bipoliate-api .
docker run -p 3000:3000 --env-file .env bipoliate-api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

MIT License - see LICENSE file for details