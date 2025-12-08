package com.hospital.lacurita.hospital.controller.Usuario;

import com.hospital.lacurita.hospital.dto.RecepcionistaPerfilDTO;
import com.hospital.lacurita.hospital.service.RecepcionistaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recepcionista")
public class RecepcionistaController {

    private final RecepcionistaService recepcionistaService;

    public RecepcionistaController(RecepcionistaService recepcionistaService) {
        this.recepcionistaService = recepcionistaService;
    }

    @GetMapping("/perfil")
    public ResponseEntity<RecepcionistaPerfilDTO> obtenerPerfil() {
        return ResponseEntity.ok(recepcionistaService.obtenerPerfilActual());
    }

    @GetMapping("/bitacora-citas")
    public ResponseEntity<java.util.List<com.hospital.lacurita.hospital.dto.Recepcionista.BitacoraCitaDTO>> getBitacoraCitas() {
        return ResponseEntity.ok(recepcionistaService.getBitacoraCitas());
    }
}
