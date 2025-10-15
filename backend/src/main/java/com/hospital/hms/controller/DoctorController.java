package com.hospital.hms.controller;

import com.hospital.hms.dto.AppointmentRequest;
import com.hospital.hms.dto.PrescriptionRequest;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorController {

    @Autowired
    private UserService userService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PrescriptionService prescriptionService;

    @GetMapping("/profile")
    public ResponseEntity<?> getDoctorProfile(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userService.getUserById(userPrincipal.getId())
                .map(user -> ResponseEntity.ok().body(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long doctorId = userPrincipal.getId();
        
        Map<String, Object> dashboard = new HashMap<>();
        
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctorId(doctorId);
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByDoctorId(doctorId);
        
        dashboard.put("totalAppointments", appointments.size());
        dashboard.put("totalPrescriptions", prescriptions.size());
        dashboard.put("recentAppointments", appointments.stream().limit(5).toList());
        dashboard.put("upcomingAppointments", appointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.SCHEDULED || apt.getStatus() == AppointmentStatus.CONFIRMED)
                .limit(5).toList());
        
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctorId(userPrincipal.getId());
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            AppointmentStatus appointmentStatus = AppointmentStatus.valueOf(status);
            Appointment updatedAppointment = appointmentService.updateAppointmentStatus(id, appointmentStatus);
            return ResponseEntity.ok(updatedAppointment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/appointments/{id}/notes")
    public ResponseEntity<?> updateAppointmentNotes(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String notes = request.get("notes");
            Appointment updatedAppointment = appointmentService.updateAppointmentNotes(id, notes);
            return ResponseEntity.ok(updatedAppointment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/prescriptions")
    public ResponseEntity<List<Prescription>> getMyPrescriptions(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByDoctorId(userPrincipal.getId());
        return ResponseEntity.ok(prescriptions);
    }

    @PostMapping("/prescriptions")
    public ResponseEntity<?> createPrescription(@Valid @RequestBody PrescriptionRequest prescriptionRequest, 
                                              Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Prescription prescription = prescriptionService.createPrescription(
                    prescriptionRequest.getPatientId(),
                    userPrincipal.getId(),
                    prescriptionRequest.getMedicineName(),
                    prescriptionRequest.getDosage(),
                    prescriptionRequest.getInstructions(),
                    prescriptionRequest.getDuration()
            );
            return ResponseEntity.ok(prescription);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/prescriptions/{id}")
    public ResponseEntity<?> updatePrescription(@PathVariable Long id, 
                                              @Valid @RequestBody PrescriptionRequest prescriptionRequest) {
        try {
            Prescription updatedPrescription = prescriptionService.updatePrescription(
                    id,
                    prescriptionRequest.getMedicineName(),
                    prescriptionRequest.getDosage(),
                    prescriptionRequest.getInstructions(),
                    prescriptionRequest.getDuration()
            );
            return ResponseEntity.ok(updatedPrescription);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/patients")
    public ResponseEntity<List<User>> getPatients() {
        return ResponseEntity.ok(userService.getPatients());
    }
}