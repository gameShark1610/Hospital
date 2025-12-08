package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.BitacoraHistorial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BitacoraHistorialRepository extends JpaRepository<BitacoraHistorial, Integer> {
    List<BitacoraHistorial> findByPacienteIdOrderByFechaMovDesc(Integer pacienteId);
}
