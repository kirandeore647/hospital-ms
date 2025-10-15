package com.hospital.hms.controller;

import com.hospital.hms.dto.JwtResponse;
import com.hospital.hms.dto.LoginRequest;
import com.hospital.hms.dto.SignupRequest;
import com.hospital.hms.entity.Role;
import com.hospital.hms.entity.User;
import com.hospital.hms.security.JwtUtils;
import com.hospital.hms.security.UserPrincipal;
import com.hospital.hms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Backend is running");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt for username: " + loginRequest.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    userDetails.getFirstName(),
                    userDetails.getLastName(),
                    userDetails.getAuthorities().iterator().next().getAuthority().equals("ROLE_ADMIN") ? Role.ADMIN :
                    userDetails.getAuthorities().iterator().next().getAuthority().equals("ROLE_DOCTOR") ? Role.DOCTOR : Role.PATIENT));
        } catch (Exception e) {
            System.out.println("Login failed for username: " + loginRequest.getUsername() + ", Error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        Map<String, String> response = new HashMap<>();

        if (userService.existsByUsername(signUpRequest.getUsername())) {
            response.put("error", "Username is already taken!");
            return ResponseEntity.badRequest().body(response);
        }

        if (userService.existsByEmail(signUpRequest.getEmail())) {
            response.put("error", "Email is already in use!");
            return ResponseEntity.badRequest().body(response);
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                           signUpRequest.getEmail(),
                           signUpRequest.getPassword(),
                           signUpRequest.getFirstName(),
                           signUpRequest.getLastName(),
                           signUpRequest.getPhoneNumber(),
                           signUpRequest.getRole());

        if (signUpRequest.getRole() == Role.DOCTOR) {
            user.setSpecialization(signUpRequest.getSpecialization());
            user.setLicenseNumber(signUpRequest.getLicenseNumber());
        } else if (signUpRequest.getRole() == Role.PATIENT) {
            user.setAddress(signUpRequest.getAddress());
            user.setEmergencyContact(signUpRequest.getEmergencyContact());
        }

        userService.createUser(user);

        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }
}