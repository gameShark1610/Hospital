package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
}
