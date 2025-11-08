package com.hospital.lacurita.hospital.controller;

import com.hospital.lacurita.hospital.model.Especialidad;
import com.hospital.lacurita.hospital.service.EspecialidadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@RequestMapping("/api/especialidad")
public class EspecialidadController {
    private final EspecialidadService especialidadService;

    public EspecialidadController(EspecialidadService especialidadService) {
        this.especialidadService = especialidadService;
    }

    @GetMapping
    public ResponseEntity<List<Especialidad>> getAllSpecialties() {
        return ResponseEntity.ok(especialidadService.getAllSpecialties());
    }
}