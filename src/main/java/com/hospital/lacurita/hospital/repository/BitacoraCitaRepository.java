package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.BitacoraCita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BitacoraCitaRepository extends JpaRepository<BitacoraCita, Integer> {
    // Find all by default is enough, maybe order by date desc
    List<BitacoraCita> findAllByOrderByFechaMovDesc();
}
