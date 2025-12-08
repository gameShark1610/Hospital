package com.hospital.lacurita.hospital.dto.Usuario;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CitaRequest {
    private LocalDate fechaAgendada;
    private Integer horarioId;
    private Integer doctorId;
}
