package com.hospital.lacurita.hospital.controller.Usuario;

import com.hospital.lacurita.hospital.dto.RecepcionistaPerfilDTO;
import com.hospital.lacurita.hospital.service.RecepcionistaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

    @GetMapping("/solicitudes-cancelacion")
    public ResponseEntity<?> getSolicitudesCancelacion() {
        // 5 = Por cancelar
        return ResponseEntity.ok(recepcionistaService.getCitasPorEstatus(5));
    }

    @GetMapping("/citas-canceladas")
    public ResponseEntity<?> getCitasCanceladas() {
        // 4 = Cancelada
        return ResponseEntity.ok(recepcionistaService.getCitasPorEstatus(4));
    }

    @PostMapping("/aprobar-cancelacion/{id}")
    public ResponseEntity<?> aprobarCancelacion(@org.springframework.web.bind.annotation.PathVariable Integer id) {
        recepcionistaService.aprobarCancelacion(id);
        return ResponseEntity.ok("Solicitud aprobada");
    }

    @PostMapping("/rechazar-cancelacion/{id}")
    public ResponseEntity<?> rechazarCancelacion(@org.springframework.web.bind.annotation.PathVariable Integer id) {
        recepcionistaService.rechazarCancelacion(id);
        return ResponseEntity.ok("Solicitud rechazada");
    }
}
