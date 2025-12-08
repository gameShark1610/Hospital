package com.hospital.lacurita.hospital.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class RegisterRecepcionistaRequest extends RegisterRequest {
    // Empleado
    private BigDecimal sueldo;
    private String curp;
    private Integer horarioId;

    // Recepcionista
    private Integer numeroExtension;
}
