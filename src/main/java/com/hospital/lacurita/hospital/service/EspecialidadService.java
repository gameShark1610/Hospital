package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.model.Especialidad;
import com.hospital.lacurita.hospital.repository.EspecialidadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EspecialidadService {
    private final EspecialidadRepository especialidadRepository;

    public EspecialidadService(EspecialidadRepository especialidadRepository) {
        this.especialidadRepository = especialidadRepository;
    }


    public List<Especialidad> getAllSpecialties() {
        return especialidadRepository.findAll();
    }

}
