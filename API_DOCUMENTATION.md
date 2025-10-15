# Hospital Management System API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication Endpoints

### 1. Health Check
**GET** `/auth/health`
- **Description**: Check if the backend is running
- **No authentication required**
- **Response**: 
```json
{
  "status": "Backend is running",
  "timestamp": "2025-10-14T18:28:22.057"
}
```

### 2. Sign In
**POST** `/auth/signin`
- **Description**: Authenticate user and get JWT token
- **No authentication required**
- **Request Body**:
```json
{
  "username": "doctor1",
  "password": "doctor123"
}
```
- **Success Response** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "doctor1",
  "email": "doctor1@hospital.com",
  "firstName": "John",
  "lastName": "Smith",
  "role": "DOCTOR"
}
```
- **Error Response** (400):
```json
{
  "error": "Invalid username or password"
}
```

### 3. Sign Up
**POST** `/auth/signup`
- **Description**: Register a new user
- **No authentication required**
- **Request Body** (for Doctor):
```json
{
  "username": "newdoctor",
  "email": "newdoctor@hospital.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "role": "DOCTOR",
  "specialization": "Cardiology",
  "licenseNumber": "DOC987654"
}
```
- **Request Body** (for Patient):
```json
{
  "username": "newpatient",
  "email": "newpatient@hospital.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Patient",
  "phoneNumber": "1234567890",
  "role": "PATIENT",
  "address": "123 Main St",
  "emergencyContact": "Jane Doe - 9876543210"
}
```

## Test Users (Created automatically)

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: ADMIN

### Doctor User
- **Username**: `doctor1`
- **Password**: `doctor123`
- **Role**: DOCTOR

### Patient User
- **Username**: `patient1`
- **Password**: `patient123`
- **Role**: PATIENT

## Testing with curl

### Test Health Check
```bash
curl -X GET "http://localhost:8080/api/auth/health"
```

### Test Sign In
```bash
curl -X POST "http://localhost:8080/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"username": "doctor1", "password": "doctor123"}'
```

### Test with Browser Developer Tools
1. Open browser and go to `http://localhost:3000/login`
2. Open Developer Tools (F12)
3. Go to Network tab
4. Try to login with `doctor1/doctor123`
5. Check the network request to see the exact request and response

## Common Issues

### CORS Error
- The backend has CORS enabled for all origins
- Make sure both frontend (port 3000) and backend (port 8080) are running

### 400 Bad Request
- Check if request body format is correct
- Ensure Content-Type header is set to "application/json"
- Verify username and password are correct

### Database Connection
- Make sure MySQL is running
- Database `hospital_db` should be created automatically
- Check application.properties for database configuration

## SpringDoc OpenAPI (Swagger)
Unfortunately, Swagger setup had compilation issues. For now, use this documentation or browser developer tools to test the API endpoints.

The backend logs will show:
- Login attempts with username
- Any authentication errors
- Database queries being executed

## Next Steps
1. Test the health endpoint first: `http://localhost:8080/api/auth/health`
2. Test signin with curl or browser developer tools
3. Check backend logs for any error messages
4. If issues persist, check database connection and user creation in logs