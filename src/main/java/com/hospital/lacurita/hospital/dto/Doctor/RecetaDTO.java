package com.hospital.lacurita.hospital.dto.Doctor;

// RecetaDTO.java
import java.util.List;
import lombok.Data; // Si usas Lombok, sino crea getters y setters manuales

@Data
public class RecetaDTO {
    private Integer citaId;
    private Integer pacienteId;
    private String diagnostico;
    private String observacion;
    private String fecha; // Formato YYYY-MM-DD
    private List<MedicamentoDTO> medicamentos; // La lista que viene del React
}