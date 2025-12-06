package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
    Optional<Paciente> findByUsuarioId(Integer id);

    @Query(value = "SELECT " +
                    "TipoSangre AS tipoSangre, " +
                    "Estatura AS altura, " +
                    "Peso AS peso, " +
                    "Alergia AS alergias " +
                    "FROM HistorialPaciente(:pacienteId)",
            nativeQuery = true
    )
    List<Object[]> obtenerHistorialRaw(@Param("pacienteId") Integer pacienteId);
}
