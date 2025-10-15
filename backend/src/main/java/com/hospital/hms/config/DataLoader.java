package com.hospital.hms.config;

import com.hospital.hms.entity.Role;
import com.hospital.hms.entity.User;
import com.hospital.hms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (!userService.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@hospital.com");
            admin.setPassword("admin123");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setPhoneNumber("1234567890");
            admin.setRole(Role.ADMIN);
            userService.createUser(admin);
            System.out.println("Admin user created: admin/admin123");
        }

        // Create doctor user if not exists
        if (!userService.existsByUsername("doctor1")) {
            User doctor = new User();
            doctor.setUsername("doctor1");
            doctor.setEmail("doctor1@hospital.com");
            doctor.setPassword("doctor123");
            doctor.setFirstName("John");
            doctor.setLastName("Smith");
            doctor.setPhoneNumber("1234567891");
            doctor.setRole(Role.DOCTOR);
            doctor.setSpecialization("Cardiology");
            doctor.setLicenseNumber("DOC123456");
            userService.createUser(doctor);
            System.out.println("Doctor user created: doctor1/doctor123");
        }

        // Create patient user if not exists
        if (!userService.existsByUsername("patient1")) {
            User patient = new User();
            patient.setUsername("patient1");
            patient.setEmail("patient1@hospital.com");
            patient.setPassword("patient123");
            patient.setFirstName("Jane");
            patient.setLastName("Doe");
            patient.setPhoneNumber("1234567892");
            patient.setRole(Role.PATIENT);
            patient.setAddress("123 Main St, City, State");
            patient.setEmergencyContact("John Doe - 9876543210");
            userService.createUser(patient);
            System.out.println("Patient user created: patient1/patient123");
        }
    }
}