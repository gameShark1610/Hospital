package com.hospital.lacurita.hospital.controller;

import com.hospital.lacurita.hospital.dto.RegisterRequest;
import com.hospital.lacurita.hospital.model.Usuario;
import com.hospital.lacurita.hospital.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class Login {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            Usuario registeredUser = userService.register(registerRequest);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok(authentication.getPrincipal());
        }
        return ResponseEntity.badRequest().body("No user authenticated");
    }
}