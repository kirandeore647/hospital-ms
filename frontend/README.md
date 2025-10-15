# Frontend Setup Instructions

## Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The frontend is configured to connect to the backend at `http://localhost:8080`. If your backend is running on a different port, update the API_URL in the service files:

- `src/services/AuthService.js`
- `src/services/ApiService.js`

## Running the Application

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   │   ├── Login.js       # Login form
│   │   └── Register.js    # Registration form
│   └── dashboards/        # Role-based dashboards
│       ├── AdminDashboard.js
│       ├── DoctorDashboard.js
│       └── PatientDashboard.js
├── services/              # API service layer
│   ├── AuthService.js     # Authentication API calls
│   └── ApiService.js      # General API calls
├── App.js                 # Main application component
├── index.js              # Application entry point
└── index.css             # Global styles
```

## Features

### Authentication
- User login and registration
- JWT token management
- Role-based routing
- Automatic logout on token expiration

### Dashboards
- **Admin Dashboard**: User management and system overview
- **Doctor Dashboard**: Appointment management and prescription creation
- **Patient Dashboard**: Appointment booking and prescription viewing

### UI Components
- Responsive design using React Bootstrap
- Date picker for appointment scheduling
- Modal forms for data entry
- Dynamic tables with sorting and filtering

## User Roles and Access

### Patient Features:
- Register and login
- Book appointments with doctors
- View appointment history
- View prescriptions
- Update profile information

### Doctor Features:
- Register and login (with specialization)
- View appointments
- Update appointment status
- Issue prescriptions
- View patient information

### Admin Features:
- View system dashboard
- Manage all users
- View all appointments and prescriptions
- System oversight and management

## API Integration

The frontend communicates with the Spring Boot backend using Axios HTTP client. All API calls include JWT authentication headers when required.

### Service Architecture:
- `AuthService`: Handles login, logout, and token management
- `ApiService`: Handles all authenticated API calls
- Automatic token refresh and error handling

## Styling

The application uses:
- React Bootstrap for UI components
- Custom CSS for additional styling
- Responsive design for mobile compatibility

## Build for Production

To create a production build:
```bash
npm run build
```

This creates an optimized build in the `build` folder, ready for deployment.

## Deployment

The built application can be deployed to any static hosting service like:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Apache/Nginx web server

## Environment Variables

For production, you may want to create a `.env` file:
```
REACT_APP_API_URL=http://your-backend-url:8080/api
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: 
   - Ensure the backend CORS configuration allows your frontend domain

2. **API Connection Issues**:
   - Check if the backend is running on the correct port
   - Verify API URLs in service files

3. **Authentication Issues**:
   - Clear browser localStorage if having token issues
   - Check JWT token expiration settings