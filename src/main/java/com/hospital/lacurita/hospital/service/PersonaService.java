package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.Usuario.UserPerfilDTO;
import com.hospital.lacurita.hospital.model.Paciente;
import com.hospital.lacurita.hospital.model.Usuario;
import com.hospital.lacurita.hospital.repository.PacienteRepository;
import com.hospital.lacurita.hospital.repository.PersonaRepository;
import com.hospital.lacurita.hospital.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class PersonaService {
    private final PersonaRepository personaRepository;
    private final UserService userService;
    private final PacienteRepository pacienteRepository;
    private final UserRepository userRepository;

    public PersonaService(PersonaRepository personaRepository, UserService userService, PacienteRepository pacienteRepository, UserRepository userRepository) {
        this.personaRepository = personaRepository;
        this.userService = userService;
        this.pacienteRepository = pacienteRepository;
        this.userRepository = userRepository;
    }

    public UserPerfilDTO mostrarDatosUsuario(){
        Integer usuarioID = userService.obtenerUsuarioIdActual();
        Usuario usuario=userRepository. findById(usuarioID).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


        UserPerfilDTO userPerfilDTO=new UserPerfilDTO();
        userPerfilDTO.setNombre(usuario.getPersona().getNombre());
        userPerfilDTO.setApellidoPaterno(usuario.getPersona().getPaterno());
        userPerfilDTO.setApellidoMaterno(usuario.getPersona().getMaterno());
        userPerfilDTO.setFechaNacimiento(usuario.getPersona().getFechaNacim());
        userPerfilDTO.setTelefono(usuario.getPersona().getTelefono());
        return userPerfilDTO;
    }



}
