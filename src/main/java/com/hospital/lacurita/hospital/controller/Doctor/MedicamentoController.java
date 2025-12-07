package com.hospital.lacurita.hospital.controller.Doctor;

import com.hospital.lacurita.hospital.dto.Usuario.DoctorDTO;
import com.hospital.lacurita.hospital.model.Especialidad;
import com.hospital.lacurita.hospital.model.Medicamento;
import com.hospital.lacurita.hospital.service.DoctorService;
import com.hospital.lacurita.hospital.service.MedicamentosServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/medicamentos")
public class MedicamentoController {
    private final MedicamentosServices medicamentosServices;

    public MedicamentoController(MedicamentosServices medicamentosServices) {
        this.medicamentosServices = medicamentosServices;
    }

    @GetMapping
    public ResponseEntity<List<Medicamento>> getAllMedicamentos() {
        return ResponseEntity.ok(medicamentosServices.getAllMedicamentos());
    }
}

