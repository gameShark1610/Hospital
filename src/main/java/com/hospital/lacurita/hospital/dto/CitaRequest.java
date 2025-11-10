package com.hospital.lacurita.hospital.dto;

import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

@Data
public class CitaRequest {
    private LocalDate FechaAgendada;
    private Integer horarioId;
    private Integer doctorId;
}
