package com.hospital.lacurita.hospital.controller.Usuario;
import com.hospital.lacurita.hospital.dto.Usuario.CitaRequest;
import com.hospital.lacurita.hospital.service.CitaService;
import com.hospital.lacurita.hospital.service.PersonaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/Cita")
public class CitaController {
    @Autowired
    private CitaService citaService;
    @Autowired
    private PersonaService personaService;

    @PostMapping("/agendar")
    public ResponseEntity<?> agendarCita(@RequestBody CitaRequest citaRequest) {
        return ResponseEntity.ok(citaService.crearCita(citaRequest));
    }

    @GetMapping("/mis-Citas")
    public ResponseEntity<?> misCitas() {
        return ResponseEntity.ok(citaService.obtenerMisCitas());

    }

    @PostMapping("/pagar/{id}")
    public ResponseEntity<?> pagarCita(@PathVariable Integer id) {
        return ResponseEntity.ok(citaService.actualizarEstatus(id));
    }

    @GetMapping("/miperfil")
    public ResponseEntity<?> miPerfil() {
        return ResponseEntity.ok(personaService.mostrarDatosUsuario());
    }

}
