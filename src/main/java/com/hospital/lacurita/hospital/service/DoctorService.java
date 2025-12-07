package com.hospital.lacurita.hospital.service;

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


}
