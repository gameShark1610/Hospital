package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Estatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstatusRepository extends JpaRepository<Estatus, Integer> {
    Optional<Estatus> findById(Integer id);

}
