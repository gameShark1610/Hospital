package com.hospital.lacurita.hospital.controller;

import com.hospital.lacurita.hospital.dto.LoginRequest;
import com.hospital.lacurita.hospital.dto.LoginResponseDTO;
import com.hospital.lacurita.hospital.dto.RegisterDoctorRequest;
import com.hospital.lacurita.hospital.dto.RegisterRecepcionistaRequest;
import com.hospital.lacurita.hospital.dto.RegisterRequest;
import com.hospital.lacurita.hospital.model.Usuario;
import com.hospital.lacurita.hospital.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class Login {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // 2. CAMBIO: Llamamos al método nuevo dentro de UserService
            userService.register(request);

            // Retornamos éxito simple
            return ResponseEntity.ok(Collections.singletonMap("message", "Usuario registrado exitosamente"));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Collections.singletonMap("message", "Error interno del servidor"));
        }
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<?> registerDoctor(@RequestBody RegisterDoctorRequest request) {
        try {
            userService.registerDoctor(request);
            return ResponseEntity.ok(Collections.singletonMap("message", "Doctor registrado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Collections.singletonMap("message", "Error interno del servidor"));
        }
    }

    @PostMapping("/register/recepcionista")
    public ResponseEntity<?> registerRecepcionista(@RequestBody RegisterRecepcionistaRequest request) {
        try {
            userService.registerRecepcionista(request);
            return ResponseEntity.ok(Collections.singletonMap("message", "Recepcionista registrada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Collections.singletonMap("message", "Error interno del servidor"));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Usuario usuario = (Usuario) authentication.getPrincipal();

            Map<String, Object> response = new HashMap<>();
            response.put("usuarioId", usuario.getId());
            response.put("usuario", usuario.getUsuario());

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No user authenticated");

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            String username = loginRequest.getUsuario();
            String password = loginRequest.getPassword();

            var authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
            var authentication = authenticationManager.authenticate(authenticationToken);

            SecurityContextHolder.getContext().setAuthentication(authentication);
            request.getSession(true).setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            Usuario usuario = userService.findByUsername(username);

            LoginResponseDTO response = new LoginResponseDTO(
                    "Login successful",
                    usuario.getTipoUsuario().getId() // IMPORTANT: avoid returning the full entity
            );

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

}