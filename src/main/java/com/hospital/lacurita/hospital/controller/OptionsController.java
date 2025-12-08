package com.hospital.lacurita.hospital.controller;

import com.hospital.lacurita.hospital.model.Consultorio;
import com.hospital.lacurita.hospital.model.HorarioEmpleado;
import com.hospital.lacurita.hospital.repository.ConsultorioRepository;
import com.hospital.lacurita.hospital.repository.HorarioEmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/options")
@CrossOrigin(origins = "*") // Or specific origin
public class OptionsController {

    @Autowired
    private ConsultorioRepository consultorioRepository;

    @Autowired
    private HorarioEmpleadoRepository horarioEmpleadoRepository;

    @GetMapping("/consultorios")
    public ResponseEntity<List<Consultorio>> getConsultorios() {
        return ResponseEntity.ok(consultorioRepository.findAll());
    }

    @GetMapping("/horarios")
    public ResponseEntity<List<HorarioEmpleado>> getHorarios() {
        return ResponseEntity.ok(horarioEmpleadoRepository.findAll());
    }
}
