package com.hospital.lacurita.hospital.controller;
import com.hospital.lacurita.hospital.dto.CitaRequest;
import com.hospital.lacurita.hospital.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/Cita")
public class CitaController {
    @Autowired
    private CitaService citaService;

    @PostMapping("/agendar")
    public ResponseEntity<?> agendarCita(@RequestBody CitaRequest citaRequest) {
        return ResponseEntity.ok(citaService.crearCita(citaRequest));
    }

    @GetMapping("/pagar")
    public ResponseEntity<?> pagarCita() {
        return ResponseEntity.notFound().build();
    }
}
