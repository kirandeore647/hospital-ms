package com.hospital.hms.repository;

import com.hospital.hms.entity.Prescription;
import com.hospital.hms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatient(User patient);
    List<Prescription> findByDoctor(User doctor);
    List<Prescription> findByPatientId(Long patientId);
    List<Prescription> findByDoctorId(Long doctorId);
    
    @Query("SELECT p FROM Prescription p WHERE p.patient.id = :patientId ORDER BY p.prescribedDate DESC")
    List<Prescription> findByPatientIdOrderByPrescribedDateDesc(@Param("patientId") Long patientId);
    
    @Query("SELECT p FROM Prescription p WHERE p.doctor.id = :doctorId ORDER BY p.prescribedDate DESC")
    List<Prescription> findByDoctorIdOrderByPrescribedDateDesc(@Param("doctorId") Long doctorId);
}