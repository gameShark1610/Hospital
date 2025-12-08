package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Recepcionista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecepcionistaRepository extends JpaRepository<Recepcionista, Integer> {
    Optional<Recepcionista> findByEmpleadoId(Integer id);
}
