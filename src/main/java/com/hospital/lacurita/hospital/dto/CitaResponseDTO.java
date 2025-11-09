package com.hospital.lacurita.hospital.dto;

import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;

@Data
public class CitaResponseDTO {
    private Integer id;
    private Instant fecha;
    private LocalDate fechaAgendada;
    private Boolean estatus;
    private Integer pacienteId;
    private Integer doctorId;
    private Integer horarioId;
}


