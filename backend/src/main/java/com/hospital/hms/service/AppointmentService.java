package com.hospital.hms.service;

import com.hospital.hms.entity.Appointment;
import com.hospital.hms.entity.AppointmentStatus;
import com.hospital.hms.entity.User;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateTimeDesc(patientId);
    }

    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateTimeDesc(doctorId);
    }

    public List<Appointment> getAppointmentsByStatus(AppointmentStatus status) {
        return appointmentRepository.findByStatus(status);
    }

    public Appointment createAppointment(Long patientId, Long doctorId, LocalDateTime appointmentDateTime, String reason) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        // Check if doctor is available at the requested time
        List<Appointment> conflictingAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateTimeBetween(
                    doctorId, 
                    appointmentDateTime.minusMinutes(30), 
                    appointmentDateTime.plusMinutes(30)
                );
        
        if (!conflictingAppointments.isEmpty()) {
            throw new RuntimeException("Doctor is not available at the requested time");
        }

        Appointment appointment = new Appointment(patient, doctor, appointmentDateTime, reason);
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointmentStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointmentNotes(Long id, String notes) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        appointment.setNotes(notes);
        return appointmentRepository.save(appointment);
    }

    public Appointment rescheduleAppointment(Long id, LocalDateTime newDateTime) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        // Check if doctor is available at the new time
        List<Appointment> conflictingAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateTimeBetween(
                    appointment.getDoctor().getId(), 
                    newDateTime.minusMinutes(30), 
                    newDateTime.plusMinutes(30)
                );
        
        // Remove current appointment from conflict check
        conflictingAppointments.removeIf(a -> a.getId().equals(id));
        
        if (!conflictingAppointments.isEmpty()) {
            throw new RuntimeException("Doctor is not available at the requested time");
        }

        appointment.setAppointmentDateTime(newDateTime);
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        appointmentRepository.delete(appointment);
    }
}