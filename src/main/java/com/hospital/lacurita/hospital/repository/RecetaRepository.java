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
                        @Param("observacion") String observacion);

        // SP 2: No retorna nada, solo inserta
        @Modifying
        @Query(value = "EXEC AgregarMedicamentoReceta :recetaId, :medicamentoId, :duracion, :tratamiento", nativeQuery = true)
        void agregarMedicamento(
                        @Param("recetaId") Integer recetaId,
                        @Param("medicamentoId") String medicamentoId,
                        @Param("duracion") String duracion,
                        @Param("tratamiento") String tratamiento);

        // Projection interface for the RecetasEmitidas view
        public interface RecetaEmitidaProjection {
                Integer getFolioCita();

                Integer getFolio();

                java.time.LocalDate getFecha();

                String getNombrePaciente();

                String getNombreDoctor();

                String getDiagnostico();

                String getObservacion();

                String getMedicamento(); // "Medicamento + ' Durante ' + Duracion"

                String getTratamiento();

                String getDuracion();
        }

        @Query(value = "SELECT * FROM RecetasEmitidas WHERE FolioCita = :id OR Folio = :id", nativeQuery = true)
        java.util.List<RecetaEmitidaProjection> findRecetaDetalles(@Param("id") Integer id);
}