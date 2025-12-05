package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Integer> {
    List<Cita> findByPacienteId(Integer id);
}
