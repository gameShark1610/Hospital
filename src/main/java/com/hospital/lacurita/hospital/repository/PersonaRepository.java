package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonaRepository extends JpaRepository<Persona, Integer> {
}
