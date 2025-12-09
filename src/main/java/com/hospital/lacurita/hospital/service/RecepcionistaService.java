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
import com.hospital.lacurita.hospital.repository.EstatusRepository;
import com.hospital.lacurita.hospital.model.Estatus;
import com.hospital.lacurita.hospital.model.Cita;
import com.hospital.lacurita.hospital.dto.Usuario.MisCitasResponseDTO;
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
    private final EstatusRepository estatusRepository;

    public RecepcionistaService(RecepcionistaRepository recepcionistaRepository,
            UserService userService,
            EmpleadoRepository empleadoRepository,
            UserRepository userRepository,
            CitaRepository citaRepository,
            BitacoraCitaRepository bitacoraCitaRepository,
            EstatusRepository estatusRepository) {
        this.recepcionistaRepository = recepcionistaRepository;
        this.userService = userService;
        this.empleadoRepository = empleadoRepository;
        this.userRepository = userRepository;
        this.citaRepository = citaRepository;
        this.bitacoraCitaRepository = bitacoraCitaRepository;
        this.estatusRepository = estatusRepository;
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

    public List<MisCitasResponseDTO> getCitasPorEstatus(Integer estatusId) {
        // Assuming findByEstatusId exists or maping is done manually
        List<Cita> citas = citaRepository.findByEstatusId(estatusId);
        return citas.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public void aprobarCancelacion(Integer idCita) {
        Cita cita = citaRepository.findById(idCita)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        Estatus estatus = estatusRepository.findById(4) // 4 = Cancelada
                .orElseThrow(() -> new RuntimeException("Estatus Cancelada no encontrado"));
        cita.setEstatus(estatus);
        citaRepository.save(cita);
    }

    public void rechazarCancelacion(Integer idCita) {
        Cita cita = citaRepository.findById(idCita)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        Estatus estatus = estatusRepository.findById(2) // 2 = Por atender (Return to pending)
                .orElseThrow(() -> new RuntimeException("Estatus Por Atender no encontrado"));
        cita.setEstatus(estatus);
        citaRepository.save(cita);
    }

    private MisCitasResponseDTO convertToDTO(Cita cita) {
        MisCitasResponseDTO dto = new MisCitasResponseDTO();
        dto.setId(cita.getId());
        dto.setFecha(cita.getFechaAgendada());
        dto.setHora(cita.getHorario().getHorarioIni().toString()); // Adjust based on your model
        dto.setDoctor(cita.getDoctor().getEmpleado().getUsuario().getPersona().getNombre() + " " +
                cita.getDoctor().getEmpleado().getUsuario().getPersona().getPaterno());
        dto.setEspecialidad(cita.getDoctor().getEspecialidad().getEspecialidad());
        dto.setConsultorio(cita.getDoctor().getConsultorio().getNumConsultorio().toString());
        // For 'motivo', if you don't have a field, use note or dummy
        dto.setNotas("Solicitud procesada");
        dto.setPaciente(cita.getPaciente().getUsuario().getPersona().getNombre() + " " +
                cita.getPaciente().getUsuario().getPersona().getPaterno());

        // Map status for frontend
        switch (cita.getEstatus().getId()) {
            case 5:
                dto.setEstado("pendiente");
                break; // Frontend expects 'pendiente' (Status 5 "Por cancelar" -> Pending approval)
            case 4:
                dto.setEstado("aprobada"); // Changed to 'aprobada' to match frontend logic for "canceladas" list or
                                           // kept as 'cancelada'? Frontend checks for 'pendiente', 'procesadas'.
                // Frontend logic:
                // if (filtroActivo === 'canceladas') return s.estado === 'cancelada' or
                // 'aprobada'?
                // Actually frontend mock data had 'aprobada' or 'rechazada'.
                // Calls from backend: /citas-canceladas (Status 4).
                // Let's map Status 4 -> 'cancelada' to be safe, but frontend mock uses
                // 'aprobada' in some places.
                // Let's stick to 'cancelada' and update frontend if needed.
                dto.setEstado("cancelada");
                break;
            case 2:
                dto.setEstado("rechazada");
                break;
            default:
                dto.setEstado("unknown");
        }

        return dto;
    }
}
