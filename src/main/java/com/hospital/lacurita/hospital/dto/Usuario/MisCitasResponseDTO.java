package com.hospital.lacurita.hospital.dto.Usuario;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
public class MisCitasResponseDTO {
    Integer id;
    String especialidad;
    String doctor;
    LocalDate fecha;
    String hora;
    String consultorio;
    String estado;
    BigDecimal precio;
    boolean pagado;
    Instant fechaPago;
    String notas;
}
