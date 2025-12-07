package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.model.Medicamento;
import com.hospital.lacurita.hospital.repository.MedicamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicamentosServices {
    private final MedicamentoRepository medicamentoRepository;

    public MedicamentosServices(MedicamentoRepository medicamentoRepository) {
        this.medicamentoRepository = medicamentoRepository;
    }

    public List<Medicamento> getAllMedicamentos() {
        return medicamentoRepository.findAll();
    }
}
