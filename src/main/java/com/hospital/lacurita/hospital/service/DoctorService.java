package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.Doctor.CitasPendientesDoctorDTO;
import com.hospital.lacurita.hospital.dto.Doctor.DoctorDatosProfesionalDTO;
import com.hospital.lacurita.hospital.dto.Usuario.DoctorDTO;
import com.hospital.lacurita.hospital.dto.Usuario.UserPerfilDTO;
import com.hospital.lacurita.hospital.model.Doctor;
import com.hospital.lacurita.hospital.model.Empleado;
import com.hospital.lacurita.hospital.model.Paciente;
import com.hospital.lacurita.hospital.model.Usuario;
import com.hospital.lacurita.hospital.repository.DoctorRepository;
import com.hospital.lacurita.hospital.repository.EmpleadoRepository;
import com.hospital.lacurita.hospital.repository.PacienteRepository;
import com.hospital.lacurita.hospital.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final UserService userService;
    private final PacienteRepository pacienteRepository;
    private final UserRepository userRepository;
    private final EmpleadoRepository empleadoRepository;

    public DoctorService(DoctorRepository doctorRepository, UserService userService, PacienteRepository pacienteRepository, UserRepository userRepository, EmpleadoRepository empleadoRepository) {
        this.doctorRepository = doctorRepository;
        this.userService = userService;
        this.pacienteRepository = pacienteRepository;
        this.userRepository = userRepository;
        this.empleadoRepository = empleadoRepository;
    }

    public List<DoctorDTO> getDoctoresPorEspecialidad(Integer especialidadId) {
        Integer idPaciente = userService.obtenerUsuarioIdActual();
        Paciente paciente = pacienteRepository.findByUsuarioId(idPaciente).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        List<Object[]> results = doctorRepository.findDoctoresByEspecialidad(especialidadId,paciente.getId());
        return results.stream()
                .map(row -> new DoctorDTO((Integer) row[0], (String) row[1]))
                .collect(Collectors.toList());
    }

    public DoctorDatosProfesionalDTO momostrarDatosDoctor(){
        Integer usuarioID = userService.obtenerUsuarioIdActual();
        Usuario usuario=userRepository. findById(usuarioID).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Empleado empleado = empleadoRepository.findByUsuarioId(usuarioID).orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        DoctorDatosProfesionalDTO doctorDatosProfesionalDTO=new DoctorDatosProfesionalDTO();
        doctorDatosProfesionalDTO.setCurp(empleado.getCurp());
        doctorDatosProfesionalDTO.setSueldo(empleado.getSueldo());
        doctorDatosProfesionalDTO.setHorario(empleado.getHorarioEmpleado().getHoraEntrada().toString() + " - " + empleado.getHorarioEmpleado().getHoraSalida().toString());

        Doctor doctor = doctorRepository.findByEmpleadoId(empleado.getId()).orElseThrow(() -> new RuntimeException("Doctor no encontrado"));
        doctorDatosProfesionalDTO.setCedula(doctor.getNumCedula().toString());
        doctorDatosProfesionalDTO.setEspecialidad(doctor.getEspecialidad().getEspecialidad());
        doctorDatosProfesionalDTO.setConsultorio(doctor.getConsultorio().getNumConsultorio().toString());

        return doctorDatosProfesionalDTO;
    }

    public List<CitasPendientesDoctorDTO> getCitasDelDoctorActual() {
        // 1. Get current Doctor ID
        Integer usuarioID = userService.obtenerUsuarioIdActual();
        Empleado empleado = empleadoRepository.findByUsuarioId(usuarioID)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
        Doctor doctor = doctorRepository.findByEmpleadoId(empleado.getId())
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado"));

        // 2. Fetch raw data as Object arrays
        List<Object[]> results = doctorRepository.findCitasByDoctorId(doctor.getId());

        // 3. Map Object[] to DTO manually
        return results.stream()
                .map(row -> {
                    Integer estatusRaw = (Integer) row[6];
                    CitasPendientesDoctorDTO dto = new CitasPendientesDoctorDTO(
                            (Integer) row[0],        // DoctorId
                            (String) row[1],         // NombreDoctor
                            (String) row[2],         // NombrePaciente
                            (Date) row[3],           // FechaAgendada
                            (String) row[4],         // Horario
                            (String) row[5],         // Telefono
                             row[7].toString()         // NumConsultorio (Index 7)
                    );

                    dto.setCitasId((Integer)  row[8]);

                    if (estatusRaw != null) {
                        switch (estatusRaw-1) {
                            case 0:
                                dto.setEstatus("pending");
                                break;
                            case 1:
                                dto.setEstatus("confirmed");
                                break;
                            case 2:
                                dto.setEstatus("completed");
                                break;
                            case 3:
                                dto.setEstatus("cancelled");
                                break;
                            default:
                                dto.setEstatus("unknown");
                        }
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }


}
