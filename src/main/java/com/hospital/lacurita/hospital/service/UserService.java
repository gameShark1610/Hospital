package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.RegisterRequest;
import com.hospital.lacurita.hospital.model.TipoUsuario;
import com.hospital.lacurita.hospital.model.User;
import com.hospital.lacurita.hospital.repository.TipoUsuarioRepository;
import com.hospital.lacurita.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User authenticate(String correo, String password) {
        User user = userRepository.findByCorreo(correo).orElse(null);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    @Transactional
    public User register(RegisterRequest registerRequest) {
        // Check if user already exists
        if (userRepository.findByCorreo(registerRequest.getCorreo()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Get TipoUsuario
        TipoUsuario tipoUsuario = tipoUsuarioRepository.findById(registerRequest.getTipoUsuarioId())
                .orElseThrow(() -> new RuntimeException("Invalid user type"));

        // Create new user
        User user = new User();
        user.setCorreo(registerRequest.getCorreo());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setTipoUsuario(tipoUsuario);

        return userRepository.save(user);
    }
}