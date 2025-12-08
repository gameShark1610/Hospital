package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.RecepcionistaPerfilDTO;
import com.hospital.lacurita.hospital.model.Empleado;
import com.hospital.lacurita.hospital.model.Recepcionista;
import com.hospital.lacurita.hospital.model.Usuario;
import com.hospital.lacurita.hospital.repository.EmpleadoRepository;
import com.hospital.lacurita.hospital.repository.RecepcionistaRepository;
import com.hospital.lacurita.hospital.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class RecepcionistaService {

    private final RecepcionistaRepository recepcionistaRepository;
    private final UserService userService;
    private final EmpleadoRepository empleadoRepository;
    private final UserRepository userRepository;

    public RecepcionistaService(RecepcionistaRepository recepcionistaRepository, UserService userService,
            EmpleadoRepository empleadoRepository, UserRepository userRepository) {
        this.recepcionistaRepository = recepcionistaRepository;
        this.userService = userService;
        this.empleadoRepository = empleadoRepository;
        this.userRepository = userRepository;
    }

    public RecepcionistaPerfilDTO obtenerPerfilActual() {
        Integer userId = userService.obtenerUsuarioIdActual();
        Usuario usuario = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Empleado empleado = empleadoRepository.findByUsuarioId(userId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        Recepcionista recepcionista = recepcionistaRepository.findByEmpleadoId(empleado.getId())
                .orElseThrow(() -> new RuntimeException("Recepcionista no encontrado"));

        RecepcionistaPerfilDTO dto = new RecepcionistaPerfilDTO();
        dto.setNombreCompleto(usuario.getPersona().getNombre() + " " +
                usuario.getPersona().getPaterno() + " " +
                (usuario.getPersona().getMaterno() != null ? usuario.getPersona().getMaterno() : ""));

        dto.setNumeroEmpleado("REC-" + empleado.getId()); // Generar un ID simple
        dto.setEmail(usuario.getUsuario());
        dto.setTelefono(usuario.getPersona().getTelefono());
        dto.setFechaNacimiento(usuario.getPersona().getFechaNacim());
        dto.setCurp(empleado.getCurp());
        dto.setNumeroExtension(recepcionista.getNumeroExtension());

        return dto;
    }
}
