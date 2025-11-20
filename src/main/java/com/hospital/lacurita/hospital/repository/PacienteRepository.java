package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
    Optional<Paciente> findByUsuarioId(Integer id);
}
