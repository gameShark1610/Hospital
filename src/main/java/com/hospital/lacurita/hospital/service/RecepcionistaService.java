package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.RecepcionistaPerfilDTO;
import com.hospital.lacurita.hospital.dto.Recepcionista.BitacoraCitaDTO;
import com.hospital.lacurita.hospital.model.Empleado;
import com.hospital.lacurita.hospital.model.Recepcionista;
import com.hospital.lacurita.hospital.model.Usuario;
import com.hospital.lacurita.hospital.repository.EmpleadoRepository;
import com.hospital.lacurita.hospital.repository.RecepcionistaRepository;
import com.hospital.lacurita.hospital.repository.UserRepository;
import com.hospital.lacurita.hospital.repository.CitaRepository;
import com.hospital.lacurita.hospital.repository.BitacoraCitaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecepcionistaService {

    private final RecepcionistaRepository recepcionistaRepository;
    private final UserService userService;
    private final EmpleadoRepository empleadoRepository;
    private final UserRepository userRepository;
    private final CitaRepository citaRepository;
    private final BitacoraCitaRepository bitacoraCitaRepository;

    public RecepcionistaService(RecepcionistaRepository recepcionistaRepository,
            UserService userService,
            EmpleadoRepository empleadoRepository,
            UserRepository userRepository,
            CitaRepository citaRepository,
            BitacoraCitaRepository bitacoraCitaRepository) {
        this.recepcionistaRepository = recepcionistaRepository;
        this.userService = userService;
        this.empleadoRepository = empleadoRepository;
        this.userRepository = userRepository;
        this.citaRepository = citaRepository;
        this.bitacoraCitaRepository = bitacoraCitaRepository;
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

        dto.setNumeroEmpleado("REC-" + empleado.getId());
        dto.setEmail(usuario.getUsuario());
        dto.setTelefono(usuario.getPersona().getTelefono());
        dto.setFechaNacimiento(usuario.getPersona().getFechaNacim());
        dto.setCurp(empleado.getCurp());
        dto.setNumeroExtension(recepcionista.getNumeroExtension());

        return dto;
    }

    public List<BitacoraCitaDTO> getBitacoraCitas() {
        List<com.hospital.lacurita.hospital.model.BitacoraCita> bitacoras = bitacoraCitaRepository
                .findAllByOrderByFechaMovDesc();

        return bitacoras.stream().map(b -> {
            String medicoNombre = "Desconocido";
            try {
                com.hospital.lacurita.hospital.model.Cita cita = citaRepository.findById(b.getFolioCita()).orElse(null);
                if (cita != null) {
                    com.hospital.lacurita.hospital.model.Doctor doctor = cita.getDoctor();
                    com.hospital.lacurita.hospital.model.Persona p = doctor.getEmpleado().getUsuario().getPersona();
                    medicoNombre = "Dr. " + p.getNombre() + " " + p.getPaterno() + " "
                            + (p.getMaterno() != null ? p.getMaterno() : "");
                }
            } catch (Exception e) {
                // Ignore errors fetching doctor name to keep log viewing robust
            }

            return new BitacoraCitaDTO(
                    b.getId(),
                    b.getFechaMov(),
                    b.getPolitica(),
                    b.getFolioCita(),
                    b.getEstatus(),
                    medicoNombre);
        }).collect(Collectors.toList());
    }
}
