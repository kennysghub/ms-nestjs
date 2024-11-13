# NestJS Microservices Application

A microservices-based application using NestJS that demonstrates user management with event-driven notifications. The application consists of two services: a User Service for managing user data and a Notification Service for handling user-related notifications.

## Architecture

- **User Service**: RESTful API handling CRUD operations for users
- **Notification Service**: Event-driven service for sending notifications
- **Message Broker**: Redis for inter-service communication
- **Error Handling**: Comprehensive error handling with custom exceptions
- **Testing**: Unit tests for critical components

## Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)
- Docker and Docker Compose (for Redis)

## Installation


1. Install dependencies for both services:
```bash
# Install User Service dependencies
cd user-service
npm install

# Install Notification Service dependencies
cd ../notification-service
npm install
```

2. Install global dependencies:
```bash
npm install -g @nestjs/cli
```

## Configuration

The application uses Redis as a message broker. The default configuration assumes Redis is running on localhost:6379. You can modify the connection settings in:
- `user-service/src/users/users.module.ts`
- `notification-service/src/main.ts`

## Running the Application

1. Start Redis using Docker:
```bash
docker-compose up -d
```

2. Start the User Service (in a new terminal):
```bash
cd user-service
npm run start:dev
```

3. Start the Notification Service (in a new terminal):
```bash
cd notification-service
npm run start:dev
```

The services will be available at:
- User Service: http://localhost:3000
- Notification Service: Running as a microservice (no HTTP endpoint)

## API Endpoints

### User Service
- `POST /users` - Create a new user
  ```bash
  curl -X POST http://localhost:3000/users \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "name": "Test User"}'
  ```

- `GET /users` - Get all users
  ```bash
  curl http://localhost:3000/users
  ```

- `GET /users/:id` - Get a specific user
  ```bash
  curl http://localhost:3000/users/:id
  ```

- `PUT /users/:id` - Update a user
  ```bash
  curl -X PUT http://localhost:3000/users/:id \
    -H "Content-Type: application/json" \
    -d '{"name": "Updated Name"}'
  ```

- `DELETE /users/:id` - Delete a user
  ```bash
  curl -X DELETE http://localhost:3000/users/:id
  ```

## Running Tests

Both services include unit tests for critical components.

```bash
# Run User Service tests
cd user-service
npm run test

# Run Notification Service tests
cd notification-service
npm run test
```






