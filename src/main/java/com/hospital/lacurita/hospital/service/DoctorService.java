package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.DoctorDTO;
import com.hospital.lacurita.hospital.model.Paciente;
import com.hospital.lacurita.hospital.repository.DoctorRepository;
import com.hospital.lacurita.hospital.repository.PacienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final UserService userService;
    private final PacienteRepository pacienteRepository;
    public DoctorService(DoctorRepository doctorRepository, UserService userService, PacienteRepository pacienteRepository) {
        this.doctorRepository = doctorRepository;
        this.userService = userService;
        this.pacienteRepository = pacienteRepository;
    }

    public List<DoctorDTO> getDoctoresPorEspecialidad(Integer especialidadId) {
        Integer idPaciente = userService.obtenerUsuarioIdActual();
        Paciente paciente = pacienteRepository.findByUsuarioId(idPaciente).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        List<Object[]> results = doctorRepository.findDoctoresByEspecialidad(especialidadId,paciente.getId());
        return results.stream()
                .map(row -> new DoctorDTO((Integer) row[0], (String) row[1]))
                .collect(Collectors.toList());
    }


}
