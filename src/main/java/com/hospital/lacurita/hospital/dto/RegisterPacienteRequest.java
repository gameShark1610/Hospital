package com.hospital.lacurita.hospital.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class RegisterPacienteRequest extends RegisterRequest {
    // Historial Medico
    private String tipoSangre;
    private BigDecimal peso;
    private BigDecimal estatura;
}
