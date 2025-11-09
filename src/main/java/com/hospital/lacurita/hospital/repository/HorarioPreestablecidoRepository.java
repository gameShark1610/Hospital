package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.HorarioPreestablecido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface HorarioPreestablecidoRepository extends JpaRepository<HorarioPreestablecido, Integer> {
    @Query(value = "SELECT * FROM HorariosDisponibles(:fechaAgendada, :doctorId)", nativeQuery = true)
    List<Object[]> findHorariosDisponibles(@Param("fechaAgendada") LocalDate fechaAgendada, @Param("doctorId") int doctorId);
}
