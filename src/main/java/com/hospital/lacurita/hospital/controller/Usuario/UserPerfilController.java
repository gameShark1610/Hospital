package com.hospital.lacurita.hospital.controller.Usuario;

import com.hospital.lacurita.hospital.dto.Usuario.CitaRequest;
import com.hospital.lacurita.hospital.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
public class UserPerfilController {
    @Autowired
    private CitaService citaService;

    @PostMapping("/agendar")
    public ResponseEntity<?> agendarCita(@RequestBody CitaRequest citaRequest) {
        return ResponseEntity.ok(citaService.crearCita(citaRequest));
    }

    @GetMapping("/mi-perfil")
    public ResponseEntity<?> userPerfil() {
        return ResponseEntity.ok(citaService.obtenerMisCitas());

    }

}