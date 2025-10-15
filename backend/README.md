# Backend Setup Instructions

## Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE hospital_management_system;
```

2. Create a MySQL user (optional):
```sql
CREATE USER 'hms_user'@'localhost' IDENTIFIED BY 'hms_password';
GRANT ALL PRIVILEGES ON hospital_management_system.* TO 'hms_user'@'localhost';
FLUSH PRIVILEGES;
```

## Configuration

Update the `src/main/resources/application.properties` file with your database credentials:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_management_system?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.show-sql=true

# Server Configuration
server.port=8080

# JWT Configuration
app.jwtSecret=hospitalManagementSystemSecretKey
app.jwtExpirationInMs=86400000
```

## Running the Application

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Testing

You can test the APIs using tools like Postman or curl:

### Register a new user:
```bash
curl -X POST http://localhost:8080/api/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "role": "PATIENT"
}'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/auth/signin \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "password": "password123"
}'
```

## Database Schema

The application will automatically create the following tables:
- `users` - Stores user information for all roles
- `appointments` - Stores appointment data
- `prescriptions` - Stores prescription information

## Troubleshooting

### Common Issues:

1. **Database Connection Error**: 
   - Check if MySQL is running
   - Verify database credentials in application.properties
   - Ensure the database exists

2. **Port Already in Use**:
   - Change the server port in application.properties
   - Or stop the process using port 8080

3. **JWT Token Issues**:
   - Check if the JWT secret is properly configured
   - Verify token expiration settings