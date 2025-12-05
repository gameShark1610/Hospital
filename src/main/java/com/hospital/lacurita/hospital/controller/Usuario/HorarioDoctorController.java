package com.hospital.lacurita.hospital.controller.Usuario;

import com.hospital.lacurita.hospital.dto.Usuario.HorariosRequest;
import com.hospital.lacurita.hospital.service.HorarioPreestablecidoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/horarios")
public class HorarioDoctorController {

    private final HorarioPreestablecidoService horarioService;

    public HorarioDoctorController(HorarioPreestablecidoService horarioService) {
        this.horarioService = horarioService;
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<HorariosRequest>> getHorariosDisponibles(
            @RequestParam("fecha") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaAgendada,
            @RequestParam("doctorId") int doctorId) {

        List<HorariosRequest> horarios = horarioService.obtenerHorariosDisponibles(fechaAgendada, doctorId);
        return ResponseEntity.ok(horarios);

    }

}
