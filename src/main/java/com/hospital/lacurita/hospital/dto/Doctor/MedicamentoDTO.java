package com.hospital.lacurita.hospital.dto.Doctor;

import lombok.Data;

// MedicamentoDTO.java
@Data
public class MedicamentoDTO {
    private String medicamentoId; // ID real del medicamento (Value del Select)
    private String tratamiento;
    private String duracion;
}
