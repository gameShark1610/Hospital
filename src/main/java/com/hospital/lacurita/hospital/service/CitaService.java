package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.CitaRequest;
import com.hospital.lacurita.hospital.dto.CitaResponseDTO;
import com.hospital.lacurita.hospital.dto.MisCitasResponseDTO;
import com.hospital.lacurita.hospital.model.Cita;
import com.hospital.lacurita.hospital.model.Doctor;
import com.hospital.lacurita.hospital.model.HorarioPreestablecido;
import com.hospital.lacurita.hospital.model.Paciente;
import com.hospital.lacurita.hospital.repository.CitaRepository;
import com.hospital.lacurita.hospital.repository.DoctorRepository;
import com.hospital.lacurita.hospital.repository.HorarioPreestablecidoRepository;
import com.hospital.lacurita.hospital.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;
    private final UserService userService;
    private final DoctorRepository doctorRepository;
    private final HorarioPreestablecidoRepository horarioRepository;

    public CitaService(CitaRepository citaRepository, PacienteRepository pacienteRepository, UserService userService, DoctorRepository doctorRepository, HorarioPreestablecidoRepository horarioRepository) {
        this.citaRepository = citaRepository;
        this.pacienteRepository = pacienteRepository;
        this.userService = userService;
        this.doctorRepository = doctorRepository;
        this.horarioRepository = horarioRepository;
    }

    public List<MisCitasResponseDTO> obtenerMisCitas() {
        Integer idPaciente = userService.obtenerUsuarioIdActual();
        List<Cita> citas = citaRepository.findByPacienteId(idPaciente);
        return citas.stream()
                .map(this::convertToMisCitasResponseDTO)
                .collect(Collectors.toList());
    }

    private MisCitasResponseDTO convertToMisCitasResponseDTO(Cita cita) {
        MisCitasResponseDTO dto = new MisCitasResponseDTO();
        dto.setId(cita.getId());
        dto.setEspecialidad(cita.getDoctor().getEspecialidad().getEspecialidad());
        dto.setDoctor(cita.getDoctor().getEmpleado().getUsuario().getPersona().getNombre() + " " + cita.getDoctor().getEmpleado().getUsuario().getPersona().getPaterno());
        dto.setFecha(cita.getFechaAgendada()); // Adjust date formatting as needed
        dto.setHora(cita.getHorario().getHorarioIni().toString()); // Adjust time formatting as needed
        dto.setConsultorio(cita.getDoctor().getConsultorio().getNumConsultorio().toString()); // Assuming there's a getConsultorio method
        dto.setEstado(cita.getEstatus() ? "Confirmada" : "Pendiente");
        // You might need to add logic for pricing, payment, etc.
        dto.setPrecio(cita.getDoctor().getEspecialidad().getPrecio()); // Assuming there's a getTarifa method
        dto.setPagado(cita.getEstatus()); // You'll need to implement payment tracking logic
        dto.setFechaPago(cita.getFecha()); // Add payment date logic if applicable
        dto.setNotas("null"); // Add notes logic if applicable

        return dto;
    }


    public CitaResponseDTO crearCita(CitaRequest citaRequest){

        Integer idPaciente = userService.obtenerUsuarioIdActual();
        Paciente paciente = pacienteRepository.findByUsuarioId(idPaciente).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        Doctor doctor= doctorRepository.findById(citaRequest.getDoctorId()).orElseThrow(() -> new RuntimeException("Doctor no encontrado"));
        HorarioPreestablecido horario = horarioRepository.findById(citaRequest.getHorarioId()).orElseThrow(() -> new RuntimeException("Horario no encontrado"));

        Cita cita = new Cita();
        cita.setFecha(Instant.now());
        cita.setFechaAgendada(citaRequest.getFechaAgendada());
        cita.setDoctor(doctor);
        cita.setPaciente(paciente);
        cita.setHorario(horario);
        cita.setEstatus(false);

        Cita citaGuardada = citaRepository.save(cita);
        return convertToDTO(citaGuardada);

    }

    private CitaResponseDTO convertToDTO(Cita cita) {
        CitaResponseDTO dto = new CitaResponseDTO();
        dto.setId(cita.getId());
        dto.setFecha(cita.getFecha());
        dto.setFechaAgendada(cita.getFechaAgendada());
        dto.setPacienteId(cita.getPaciente().getId());
        dto.setDoctorId(cita.getDoctor().getId());
        dto.setHorarioId(cita.getHorario().getId());
        dto.setEstatus(cita.getEstatus());
        return dto;
    }



}
