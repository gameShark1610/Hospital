package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.RegisterRequest;
import com.hospital.lacurita.hospital.dto.Usuario.UserPerfilDTO;
import com.hospital.lacurita.hospital.model.Paciente;
import com.hospital.lacurita.hospital.model.Persona;
import com.hospital.lacurita.hospital.model.TipoUsuario;
import com.hospital.lacurita.hospital.model.Usuario;
import com.hospital.lacurita.hospital.repository.PacienteRepository;
import com.hospital.lacurita.hospital.repository.PersonaRepository;
import com.hospital.lacurita.hospital.repository.TipoUsuarioRepository;
import com.hospital.lacurita.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

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
    public void register(RegisterRequest registerRequest) {

        // 1. Validar si el usuario ya existe (Buena práctica hacerlo antes de llamar a BD)
        if (userRepository.findByUsuario(registerRequest.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // 2. Encriptar la contraseña (El SP espera el string ya encriptado)
        String passwordEncriptada = passwordEncoder.encode(registerRequest.getPassword());

        // 3. Convertir el Sexo (String) a ID (int) para el SP
        // Asumiendo: 1 = Masculino, 0 = Femenino. Ajusta según tu lógica.
        int sexoId = 0;
        if (registerRequest.getSexo() != null &&
                (registerRequest.getSexo().equalsIgnoreCase("Masculino") || registerRequest.getSexo().equalsIgnoreCase("M"))) {
            sexoId = 1;
        }

        // 4. Llamar al Stored Procedure mediante el Repositorio JPA
        userRepository.registrarUsuarioSp(
                registerRequest.getCorreo(),
                passwordEncriptada,
                registerRequest.getNombre(),
                registerRequest.getPaterno(),
                registerRequest.getMaterno(),
                registerRequest.getFechaNacim(),
                registerRequest.getTipoUsuarioId(),
                sexoId,
                registerRequest.getTelefono()
        );
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

    public Usuario findByUsername(String username) {
        return userRepository.findByUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }


    public Integer obtenerUsuarioIdActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof Usuario usuario) {
                return usuario.getId();
            }
        }
        return null;
    }

    /*public UserPerfilDTO obtenerPerfilUsuarioActual() {
        Usuario usuario = userRepository.findById(obtenerUsuarioIdActual()).get();
        UserPerfilDTO userPerfilDTO=new UserPerfilDTO();
        userPerfilDTO.setNombre(usuario.getPersona().getNombre());
        userPerfilDTO.setApellidos(usuario.getPersona().getPaterno()+" "+usuario.getPersona().getMaterno());
        userPerfilDTO.setEmail(usuario.getUsuario());
        userPerfilDTO.setFechaNacimiento(usuario.getPersona().getFechaNacim());
        userPerfilDTO.setGenero(usuario.getPersona().getSexo() ? "Masculino" : "Femenino");

        Paciente paciente = pacienteRepository.findByUsuarioId(usuario.getId()).orElse(null);
        userPerfilDTO.setAltura(paciente.getHistorialMedico() != null ? paciente.getHistorialMedico().getEstatura() : new BigDecimal("0.0"));
        return userPerfilDTO;
    }*/

}