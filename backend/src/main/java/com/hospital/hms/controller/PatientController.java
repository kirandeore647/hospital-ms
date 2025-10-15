package com.hospital.hms.controller;

import com.hospital.hms.dto.AppointmentRequest;
import com.hospital.hms.entity.Appointment;
import com.hospital.hms.entity.AppointmentStatus;
import com.hospital.hms.entity.Prescription;
import com.hospital.hms.entity.User;
import com.hospital.hms.security.UserPrincipal;
import com.hospital.hms.service.AppointmentService;
import com.hospital.hms.service.PrescriptionService;
import com.hospital.hms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/patient")
@PreAuthorize("hasRole('PATIENT')")
public class PatientController {

    @Autowired
    private UserService userService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PrescriptionService prescriptionService;

    @GetMapping("/profile")
    public ResponseEntity<?> getPatientProfile(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userService.getUserById(userPrincipal.getId())
                .map(user -> ResponseEntity.ok().body(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User userDetails, Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User updatedUser = userService.updateUser(userPrincipal.getId(), userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long patientId = userPrincipal.getId();
        
        Map<String, Object> dashboard = new HashMap<>();
        
        List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(patientId);
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByPatientId(patientId);
        
        dashboard.put("totalAppointments", appointments.size());
        dashboard.put("totalPrescriptions", prescriptions.size());
        dashboard.put("recentAppointments", appointments.stream().limit(5).toList());
        dashboard.put("upcomingAppointments", appointments.stream()
                .filter(apt -> apt.getAppointmentDateTime().isAfter(LocalDateTime.now()) && 
                              (apt.getStatus() == AppointmentStatus.SCHEDULED || apt.getStatus() == AppointmentStatus.CONFIRMED))
                .limit(5).toList());
        
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(userPrincipal.getId());
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@Valid @RequestBody AppointmentRequest appointmentRequest, 
                                           Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Appointment appointment = appointmentService.createAppointment(
                    userPrincipal.getId(),
                    appointmentRequest.getDoctorId(),
                    appointmentRequest.getAppointmentDateTime(),
                    appointmentRequest.getReason()
            );
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/appointments/{id}/reschedule")
    public ResponseEntity<?> rescheduleAppointment(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            LocalDateTime newDateTime = LocalDateTime.parse(request.get("appointmentDateTime"));
            Appointment updatedAppointment = appointmentService.rescheduleAppointment(id, newDateTime);
            return ResponseEntity.ok(updatedAppointment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            appointmentService.updateAppointmentStatus(id, AppointmentStatus.CANCELLED);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Appointment cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/prescriptions")
    public ResponseEntity<List<Prescription>> getMyPrescriptions(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByPatientId(userPrincipal.getId());
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        return ResponseEntity.ok(userService.getDoctors());
    }
}