package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Empleado;
import com.hospital.lacurita.hospital.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
    Optional<Empleado> findByUsuarioId(Integer id);
}
