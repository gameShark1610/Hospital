package com.hospital.lacurita.hospital.dto.Doctor;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DoctorDatosProfesionalDTO {
    private String cedula;
    private String curp;
    private String especialidad;
    private String consultorio;
    private String horario;
    private BigDecimal sueldo;

}
