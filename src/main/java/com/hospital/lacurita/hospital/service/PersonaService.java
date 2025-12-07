package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.Usuario.DatosMedicosDTO;
import com.hospital.lacurita.hospital.dto.Usuario.UserPerfilDTO;
import com.hospital.lacurita.hospital.model.Paciente;
import com.hospital.lacurita.hospital.model.Usuario;
import com.hospital.lacurita.hospital.repository.PacienteRepository;
import com.hospital.lacurita.hospital.repository.PersonaRepository;
import com.hospital.lacurita.hospital.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
        userPerfilDTO.setGenero(usuario.getPersona().getSexo() ? "masculino" : "femenino");
        return userPerfilDTO;
    }

    public DatosMedicosDTO mostrarDatosMedicos() {
        Integer usuarioID = userService.obtenerUsuarioIdActual();
        Paciente paciente = pacienteRepository.findByUsuarioId(usuarioID).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        List<Object[]> result = pacienteRepository.obtenerHistorialRaw(paciente.getId());
        if (result.isEmpty()) {
            return null;
        }
        Object[] row = result.get(0);
        DatosMedicosDTO datosMedicosDTO = new DatosMedicosDTO();
        datosMedicosDTO.setTipoSangre(row[0].toString());
        datosMedicosDTO.setAltura(row[1].toString());
        datosMedicosDTO.setPeso(row[2].toString());
        datosMedicosDTO.setAlergias(row[3].toString());
        return datosMedicosDTO;
    }




}
