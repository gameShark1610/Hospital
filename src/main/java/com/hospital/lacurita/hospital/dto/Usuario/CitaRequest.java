package com.hospital.lacurita.hospital.dto.Usuario;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CitaRequest {
    private LocalDate FechaAgendada;
    private Integer horarioId;
    private Integer doctorId;
}
