package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.DoctorDTO;
import com.hospital.lacurita.hospital.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final UserService userService;
    public DoctorService(DoctorRepository doctorRepository, UserService userService) {
        this.doctorRepository = doctorRepository;
        this.userService = userService;
    }

    public List<DoctorDTO> getDoctoresPorEspecialidad(Integer especialidadId) {
        Integer idPaciente = userService.obtenerUsuarioIdActual();
        List<Object[]> results = doctorRepository.findDoctoresByEspecialidad(especialidadId,idPaciente);
        return results.stream()
                .map(row -> new DoctorDTO((Integer) row[0], (String) row[1]))
                .collect(Collectors.toList());
    }


}
