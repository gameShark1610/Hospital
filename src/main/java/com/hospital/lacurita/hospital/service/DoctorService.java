package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.Doctor.CitasPendientesDoctorDTO;
import com.hospital.lacurita.hospital.dto.Doctor.DoctorDatosProfesionalDTO;
import com.hospital.lacurita.hospital.dto.Doctor.HistorialPacienteDTO;
import com.hospital.lacurita.hospital.dto.Usuario.DoctorDTO;
import com.hospital.lacurita.hospital.model.BitacoraHistorial;
import com.hospital.lacurita.hospital.model.Doctor;
import com.hospital.lacurita.hospital.model.Empleado;
import com.hospital.lacurita.hospital.model.HistorialAlergia;
import com.hospital.lacurita.hospital.model.HistorialMedico;
import com.hospital.lacurita.hospital.model.Paciente;
import com.hospital.lacurita.hospital.model.Persona;
import com.hospital.lacurita.hospital.model.Usuario;
import com.hospital.lacurita.hospital.repository.BitacoraHistorialRepository;
import com.hospital.lacurita.hospital.repository.DoctorRepository;
import com.hospital.lacurita.hospital.repository.EmpleadoRepository;
import com.hospital.lacurita.hospital.repository.HistorialAlergiaRepository;
import com.hospital.lacurita.hospital.repository.PacienteRepository;
import com.hospital.lacurita.hospital.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final UserService userService;
    private final PacienteRepository pacienteRepository;
    private final EmpleadoRepository empleadoRepository;
    private final BitacoraHistorialRepository bitacoraHistorialRepository;
    private final HistorialAlergiaRepository historialAlergiaRepository;

    public DoctorService(DoctorRepository doctorRepository, UserService userService,
            PacienteRepository pacienteRepository, UserRepository userRepository,
            EmpleadoRepository empleadoRepository,
            BitacoraHistorialRepository bitacoraHistorialRepository,
            HistorialAlergiaRepository historialAlergiaRepository) {
        this.doctorRepository = doctorRepository;
        this.userService = userService;
        this.pacienteRepository = pacienteRepository;
        this.empleadoRepository = empleadoRepository;
        this.bitacoraHistorialRepository = bitacoraHistorialRepository;
        this.historialAlergiaRepository = historialAlergiaRepository;
    }

    public List<DoctorDTO> getDoctoresPorEspecialidad(Integer especialidadId) {
        Integer idPaciente = userService.obtenerUsuarioIdActual();
        Paciente paciente = pacienteRepository.findByUsuarioId(idPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        List<Object[]> results = doctorRepository.findDoctoresByEspecialidad(especialidadId, paciente.getId());
        return results.stream()
                .map(row -> new DoctorDTO((Integer) row[0], (String) row[1]))
                .collect(Collectors.toList());
    }

    public DoctorDatosProfesionalDTO momostrarDatosDoctor() {
        Integer usuarioID = userService.obtenerUsuarioIdActual();
        Empleado empleado = empleadoRepository.findByUsuarioId(usuarioID)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        DoctorDatosProfesionalDTO doctorDatosProfesionalDTO = new DoctorDatosProfesionalDTO();
        doctorDatosProfesionalDTO.setCurp(empleado.getCurp());
        doctorDatosProfesionalDTO.setSueldo(empleado.getSueldo());
        doctorDatosProfesionalDTO.setHorario(empleado.getHorarioEmpleado().getHoraEntrada().toString() + " - "
                + empleado.getHorarioEmpleado().getHoraSalida().toString());

        Doctor doctor = doctorRepository.findByEmpleadoId(empleado.getId())
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado"));
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
                            (Integer) row[0], // DoctorId
                            (String) row[1], // NombreDoctor
                            (String) row[2], // NombrePaciente
                            (Date) row[3], // FechaAgendada
                            (String) row[4], // Horario
                            (String) row[5], // Telefono
                            row[7].toString() // NumConsultorio (Index 7)
                    );

                    dto.setCitasId((Integer) row[8]);

                    if (estatusRaw != null) {
                        switch (estatusRaw - 1) {
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
                            case 4:
                                dto.setEstatus("to cancel");
                            default:
                                dto.setEstatus("unknown");
                        }
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional
    public void eliminarDoctor(Integer doctorId) {
        doctorRepository.eliminarDoctorSp(doctorId);
    }

    public List<DoctorDTO> buscarDoctores(String query) {
        List<Object[]> results = doctorRepository.buscarPorIdONombre(query);
        return results.stream()
                .map(row -> {
                    // d.DoctorId, p.Nombre, p.Paterno, p.Materno, e.Especialidad, c.NumConsultorio
                    Integer id = (Integer) row[0];
                    String nombre = row[1] + " " + row[2] + " " + (row[3] != null ? row[3] : "");
                    String especialidad = (String) row[4];
                    String consultorio = row[5].toString();
                    return new DoctorDTO(id, nombre, especialidad, consultorio);
                })
                .collect(Collectors.toList());
    }

    public HistorialPacienteDTO getHistorialPaciente(Integer pacienteId) {
        // 1. Fetch Paciente
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Usuario usuario = paciente.getUsuario();
        Persona persona = usuario.getPersona();
        HistorialMedico historial = paciente.getHistorialMedico();

        // 2. Fetch Allergies
        List<HistorialAlergia> alergiasRel = historialAlergiaRepository.findByHistorialMedicoId(historial.getId());
        String alergiasStr = alergiasRel.stream()
                .map(ha -> ha.getAlergia().getAlergia())
                .collect(Collectors.joining(", "));
        if (alergiasStr.isEmpty())
            alergiasStr = "Ninguna";

        // 3. Fetch Bitacora
        List<BitacoraHistorial> bitacoraRaw = bitacoraHistorialRepository
                .findByPacienteIdOrderByFechaMovDesc(paciente.getId());

        // 4. Map Bitacora
        List<HistorialPacienteDTO.BitacoraDetalleDTO> bitacoraMapped = bitacoraRaw.stream()
                .map(b -> {

                    Doctor doctor= doctorRepository.findById(b.getDoctorId()).orElseThrow(() -> new RuntimeException("Doctor no encontrado"));
                    String medicoNombre = "Dr. " + doctor.getEmpleado().getUsuario().getPersona().getNombre()+" "+doctor.getEmpleado().getUsuario().getPersona().getPaterno()+" "+doctor.getEmpleado().getUsuario().getPersona().getMaterno();
                    return new HistorialPacienteDTO.BitacoraDetalleDTO(
                            b.getId(),
                            b.getFechaMov(),
                            b.getFechaCita(),
                            medicoNombre,
                            b.getEspecialidad(),
                            b.getDiagnostico(),
                            String.valueOf(b.getConsultorio()),
                            null,
                            null,
                            null,
                            null);
                }).collect(Collectors.toList());

        // 5. Calculate Age
        String edad = "Desconocida";
        if (persona.getFechaNacim() != null) {
            edad = Period.between(persona.getFechaNacim(), LocalDate.now()).getYears() + " años";
        }

        return new HistorialPacienteDTO(
                paciente.getId(),
                persona.getNombre() + " " + persona.getPaterno() + " "
                        + (persona.getMaterno() != null ? persona.getMaterno() : ""),
                edad,
                historial.getTipoSangre(),
                persona.getTelefono(),
                alergiasStr,
                bitacoraMapped.size() + " visitas",
                bitacoraMapped);
    }

}
