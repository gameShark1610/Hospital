package com.hospital.lacurita.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.lacurita.hospital.model.Alergia;

import java.util.Optional;

public interface AlergiaRepository extends JpaRepository<Alergia, Integer> {
    Optional<Alergia> findById(Integer id);
}
