# Hospital Management System (HMS)

A comprehensive Hospital Management System built with **Spring Boot** backend and **React** frontend, featuring role-based access control for Admins, Doctors, and Patients.

## 🏥 Features

### Core Functionality
- **Patient Registration and Login** - Patients can register and manage their profiles
- **Appointment Scheduling** - Patients can book, view, and manage appointments
- **Doctor Management** - Doctors can view appointments and manage patient consultations
- **Prescription Management** - Doctors can issue prescriptions electronically
- **Admin Dashboard** - Comprehensive oversight of appointments and patient data

### User Roles & Access Control
- **Admin**: Manages all users, appointments, and system oversight
- **Doctor**: Manages appointments, updates consultation records, issues prescriptions
- **Patient**: Registers, books appointments, views prescriptions

### Security Features
- JWT-based authentication
- Role-based access control
- Password encryption with BCrypt
- Secure API endpoints

## 🛠️ Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.1.0**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Database ORM)
- **MySQL** (Database)
- **Maven** (Build Tool)

### Frontend
- **React 18.2.0**
- **React Router** (Navigation)
- **React Bootstrap** (UI Components)
- **Axios** (HTTP Client)
- **React DatePicker** (Date Selection)

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/2124-programmer/hospital-ms.git
cd hospital-ms
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE hospital_management_system;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### 3. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies and run:
```bash
mvn clean install
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

### 4. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
hospital-ms/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/hospital/hms/
│   │   ├── controller/        # REST Controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA Entities
│   │   ├── repository/       # Repository Interfaces
│   │   ├── security/         # Security Configuration
│   │   └── service/          # Business Logic Services
│   └── src/main/resources/
│       └── application.properties
├── frontend/                   # React Frontend
│   ├── public/
│   └── src/
│       ├── components/       # React Components
│       │   ├── auth/        # Authentication Components
│       │   └── dashboards/  # Role-based Dashboards
│       └── services/        # API Services
└── README.md
```

## 🔑 Default Admin Account

To access the admin dashboard, you can create an admin account by:

1. Register as a normal user first
2. Manually update the user role in the database:
```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';
```

## 🎯 API Endpoints

### Authentication Endpoints
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users
- `GET /api/admin/doctors` - Get all doctors
- `GET /api/admin/patients` - Get all patients

### Doctor Endpoints (Requires DOCTOR role)
- `GET /api/doctor/dashboard` - Doctor dashboard data
- `GET /api/doctor/appointments` - Get doctor's appointments
- `POST /api/doctor/prescriptions` - Create prescription
- `PUT /api/doctor/appointments/{id}/status` - Update appointment status

### Patient Endpoints (Requires PATIENT role)
- `GET /api/patient/dashboard` - Patient dashboard data
- `GET /api/patient/appointments` - Get patient's appointments
- `POST /api/patient/appointments` - Book new appointment
- `GET /api/patient/prescriptions` - Get patient's prescriptions

## 🔒 Security Configuration

The application uses JWT tokens for authentication with the following security measures:

- Password hashing using BCrypt
- JWT token expiration (24 hours)
- Role-based access control
- CORS configuration for frontend integration

## 🎨 User Interface

### Login & Registration
- Clean, responsive login form
- Comprehensive registration with role selection
- Form validation and error handling

### Dashboards
- **Admin Dashboard**: System overview with statistics and user management
- **Doctor Dashboard**: Appointment management and prescription creation
- **Patient Dashboard**: Appointment booking and prescription viewing

## 🧪 Testing

To run backend tests:
```bash
cd backend
mvn test
```

To run frontend tests:
```bash
cd frontend
npm test
```

## 📝 Usage Instructions

### For Patients:
1. Register with role "Patient"
2. Login to access patient dashboard
3. Book appointments with available doctors
4. View appointment history and prescriptions

### For Doctors:
1. Register with role "Doctor" (include specialization and license number)
2. Login to access doctor dashboard
3. View and manage appointments
4. Issue prescriptions to patients

### For Admins:
1. Create admin account (manual database update required)
2. Login to access admin dashboard
3. Manage all users, appointments, and system oversight

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for better healthcare management**