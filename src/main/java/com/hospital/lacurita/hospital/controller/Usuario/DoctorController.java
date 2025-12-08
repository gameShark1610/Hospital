package com.hospital.lacurita.hospital.controller.Usuario;

import com.hospital.lacurita.hospital.dto.Doctor.RecetaDTO;
import com.hospital.lacurita.hospital.dto.Usuario.DoctorDTO;
import com.hospital.lacurita.hospital.service.CitaService;
import com.hospital.lacurita.hospital.service.DoctorService;
import com.hospital.lacurita.hospital.service.RecetaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctores")
public class DoctorController {

    private final DoctorService doctorService;
    private final RecetaService recetaService;
    private final CitaService citaService;

    public DoctorController(DoctorService doctorService, RecetaService recetaService, CitaService citaService) {
        this.doctorService = doctorService;
        this.recetaService = recetaService;
        this.citaService = citaService;
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

    @GetMapping("/citasPendientes")
    public ResponseEntity<?> miCitasPendientes() {
        return ResponseEntity.ok(doctorService.getCitasDelDoctorActual());
    }

    @PostMapping("/guardarReceta")
    public ResponseEntity<?> guardarReceta(@RequestBody RecetaDTO recetaDTO) {
        try {
            recetaService.crearRecetaCompleta(recetaDTO);
            return ResponseEntity.ok("Receta guardada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Integer id) {
        try {
            doctorService.eliminarDoctor(id);
            return ResponseEntity.ok("Doctor eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al eliminar doctor: " + e.getMessage());
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<DoctorDTO>> buscarDoctores(@RequestParam("query") String query) {
        return ResponseEntity.ok(doctorService.buscarDoctores(query));
    }

    @GetMapping("/historial/{pacienteId}")
    public ResponseEntity<com.hospital.lacurita.hospital.dto.Doctor.HistorialPacienteDTO> getHistorial(
            @PathVariable Integer pacienteId) {
        return ResponseEntity.ok(doctorService.getHistorialPaciente(pacienteId));
    }

    @PostMapping("/cancelar/{id}")
    public ResponseEntity<?> solicitarCancelacionDoctor(@PathVariable Integer id) {
        return citaService.solicitarCancelacionDoctor(id);
    }
}
