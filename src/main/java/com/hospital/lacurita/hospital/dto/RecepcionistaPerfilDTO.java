package com.hospital.lacurita.hospital.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RecepcionistaPerfilDTO {
    private String nombreCompleto;
    private String numeroEmpleado; // "REC-2024-" + id ? Or just ID
    private String email;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String curp;
    private Integer numeroExtension;

    // Optional: fechaIngreso if we had it, but we don't.
}
