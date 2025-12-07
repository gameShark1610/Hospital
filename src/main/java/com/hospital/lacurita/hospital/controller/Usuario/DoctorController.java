package com.hospital.lacurita.hospital.controller.Usuario;


import com.hospital.lacurita.hospital.dto.Usuario.DoctorDTO;
import com.hospital.lacurita.hospital.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doctores")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping("/especialidad/{id}")
    public ResponseEntity<List<DoctorDTO>> getDoctoresPorEspecialidad(@PathVariable Integer id) {
        List<DoctorDTO> doctores = doctorService.getDoctoresPorEspecialidad(id);
        return ResponseEntity.ok(doctores);
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> miPerfil() {
        return ResponseEntity.ok(doctorService.momostrarDatosDoctor());
    }
}
