package com.hospital.hms.repository;

import com.hospital.hms.entity.Appointment;
import com.hospital.hms.entity.AppointmentStatus;
import com.hospital.hms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(User patient);
    List<Appointment> findByDoctor(User doctor);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByStatus(AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDateTime BETWEEN :startTime AND :endTime")
    List<Appointment> findByDoctorIdAndAppointmentDateTimeBetween(@Param("doctorId") Long doctorId, 
                                                                 @Param("startTime") LocalDateTime startTime, 
                                                                 @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId ORDER BY a.appointmentDateTime DESC")
    List<Appointment> findByPatientIdOrderByAppointmentDateTimeDesc(@Param("patientId") Long patientId);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId ORDER BY a.appointmentDateTime DESC")
    List<Appointment> findByDoctorIdOrderByAppointmentDateTimeDesc(@Param("doctorId") Long doctorId);
}