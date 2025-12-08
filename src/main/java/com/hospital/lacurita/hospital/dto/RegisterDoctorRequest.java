package com.hospital.lacurita.hospital.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class RegisterDoctorRequest extends RegisterRequest {
    // Historial Médico (Requerido para Paciente)
    private String tipoSangre;
    private BigDecimal peso;
    private BigDecimal estatura; // Parte del modelo HistorialMedico

    // Empleado
    private BigDecimal sueldo;
    private String curp; // "cuerpo" que menciono el usuario, pero es CURP en el modelo
    private Integer horarioId; // Viene de HorarioEmpleado

    // Doctor
    private Integer numCedula;
    private Integer especialidadId;
    private Integer consultorioId;
}
