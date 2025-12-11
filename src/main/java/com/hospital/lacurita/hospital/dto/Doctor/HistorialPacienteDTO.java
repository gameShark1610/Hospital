package com.hospital.lacurita.hospital.dto.Doctor;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HistorialPacienteDTO {
    // Info Paciente
    private Integer id;
    private String nombre;
    private String edad;
    private String tipoSangre;
    private String telefono;
    private String alergias;
    private String totalConsultas;

    // Bitacora
    private List<BitacoraDetalleDTO> bitacora;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BitacoraDetalleDTO {
        private Integer id;
        private Instant fechaMov;
        private LocalDate fechaCita;
        private String medico;
        private String especialidad;
        private String diagnostico;
        private String consultorio;
        private String motivo; // Optional/Null if not in BitacoraHistorial (Only Diagnostico available)
        private String sintomas; // Optional
        private String tratamiento; // Optional
        private String notas; // Optional

        // New Detailed Fields
        private Integer recetaFolio;
        private List<String> diagnosticos;
        private List<String> observaciones;
        private List<MedicamentoDetalleDTO> medicamentos;

        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        public static class MedicamentoDetalleDTO {
            private String nombre;
            private String tratamiento;
            private String duracion;
        }
    }
}
