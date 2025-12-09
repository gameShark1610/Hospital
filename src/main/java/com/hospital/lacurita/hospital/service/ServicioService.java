package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.model.Servicio;
import com.hospital.lacurita.hospital.repository.ServicioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioService {
    private final ServicioRepository servicioRepository;

    public ServicioService(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    public List<Servicio> getAllServicios() {
        return servicioRepository.findAll();
    }
}
