package com.hospital.hms.service;

import com.hospital.hms.entity.Prescription;
import com.hospital.hms.entity.User;
import com.hospital.hms.repository.PrescriptionRepository;
import com.hospital.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {
    
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public List<Prescription> getPrescriptionsByPatientId(Long patientId) {
        return prescriptionRepository.findByPatientIdOrderByPrescribedDateDesc(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctorId(Long doctorId) {
        return prescriptionRepository.findByDoctorIdOrderByPrescribedDateDesc(doctorId);
    }

    public Prescription createPrescription(Long patientId, Long doctorId, String medicineName, 
                                         String dosage, String instructions, Integer duration) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        Prescription prescription = new Prescription(patient, doctor, medicineName, dosage, instructions, duration);
        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescription(Long id, String medicineName, String dosage, String instructions, Integer duration) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        
        prescription.setMedicineName(medicineName);
        prescription.setDosage(dosage);
        prescription.setInstructions(instructions);
        prescription.setDuration(duration);
        
        return prescriptionRepository.save(prescription);
    }

    public void deletePrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        prescriptionRepository.delete(prescription);
    }
}