package com.hospital.lacurita.hospital.dto;

import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

@Data
public class CitaRequest {
    private Instant fecha;
    private LocalDate FechaAgendad;
    private LocalTime hora;
    private String doctor;
}
