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

    public void agregarStock(Integer id, Integer cantidad) {
        Medicamento medicamento = medicamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicamento no encontrado"));

        medicamento.setCantidad(medicamento.getCantidad() + cantidad);

        // Update stock boolean status logic if needed.
        // Assuming stock = true means available?
        // User didn't specify exact logic for 'Stock' boolean, but typically count > 0
        // -> true.
        if (medicamento.getCantidad() > 0) {
            medicamento.setStock(true);
        }

        medicamentoRepository.save(medicamento);
    }
}
