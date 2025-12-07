package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Receta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecetaRepository extends JpaRepository<Receta, Integer> {

    // SP 1: Retorna un Integer (El ID de la receta creada)
    @Query(value = "EXEC CrearEncabezadoReceta :folioCita, :diagnostico, :observacion", nativeQuery = true)
    Integer crearEncabezado(
            @Param("folioCita") Integer folioCita,
            @Param("diagnostico") String diagnostico,
            @Param("observacion") String observacion
    );

    // SP 2: No retorna nada, solo inserta
    @Modifying
    @Query(value = "EXEC AgregarMedicamentoReceta :recetaId, :medicamentoId, :duracion, :tratamiento", nativeQuery = true)
    void agregarMedicamento(
            @Param("recetaId") Integer recetaId,
            @Param("medicamentoId") String medicamentoId,
            @Param("duracion") String duracion,
            @Param("tratamiento") String tratamiento
    );
}