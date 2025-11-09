package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.RegisterRequest;
import com.hospital.lacurita.hospital.model.Paciente;
import com.hospital.lacurita.hospital.model.Persona;
import com.hospital.lacurita.hospital.model.TipoUsuario;
import com.hospital.lacurita.hospital.model.Usuario;
import com.hospital.lacurita.hospital.repository.PacienteRepository;
import com.hospital.lacurita.hospital.repository.PersonaRepository;
import com.hospital.lacurita.hospital.repository.TipoUsuarioRepository;
import com.hospital.lacurita.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PersonaRepository personaRepository;

    public Usuario authenticate(String correo, String password) {
        Usuario user = userRepository.findByUsuario(correo).orElse(null);
        if (user != null && passwordEncoder.matches(password, user.getContraseña())) {
            return user;
        }
        return null;
    }

    @Transactional
    public Usuario register(RegisterRequest registerRequest) {
        Persona persona = new Persona();
        persona.setNombre(registerRequest.getNombre());
        persona.setPaterno(registerRequest.getPaterno());
        persona.setMaterno(registerRequest.getMaterno());
        persona.setFechaNacim(registerRequest.getFechaNacim());

        personaRepository.save(persona);

        // Check if user already exists
        if (userRepository.findByUsuario(registerRequest.getCorreo()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Get TipoUsuario
        TipoUsuario tipoUsuario = tipoUsuarioRepository.findById(registerRequest.getTipoUsuarioId())
                .orElseThrow(() -> new RuntimeException("Invalid user type"));

        // Create new user
        Usuario user = new Usuario();
        user.setUsuario(registerRequest.getCorreo());
        user.setContraseña(passwordEncoder.encode(registerRequest.getPassword()));
        user.setTipoUsuario(tipoUsuario);
        user.setPersona(persona);
        userRepository.save(user);
        //Create kind of user
        createTipoUsuario(tipoUsuario, user);

        return user;
    }

    public void createTipoUsuario(TipoUsuario tipoUsuario, Usuario user) {
        switch (tipoUsuario.getId()){
            case 1:
                Paciente paciente = new Paciente();
                paciente.setUsuario(user);
                pacienteRepository.save(paciente);
                break;
            case 2:
                //tipoUsuarioRepository.save(tipoUsuario);
                break;
            case 3:
                //tipoUsuarioRepository.save(tipoUsuario);
                break;
        }
    }

}