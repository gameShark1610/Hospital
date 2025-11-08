package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.DoctorDTO;
import com.hospital.lacurita.hospital.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<DoctorDTO> getDoctoresPorEspecialidad(Integer especialidadId) {
        List<Object[]> results = doctorRepository.findDoctoresByEspecialidad(especialidadId);
        return results.stream()
                .map(row -> new DoctorDTO((Integer) row[0], (String) row[1]))
                .collect(Collectors.toList());
    }


}
