package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicamentoRepository extends JpaRepository<Medicamento, Integer> {
}
