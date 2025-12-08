package com.hospital.lacurita.hospital.dto.Recepcionista;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BitacoraCitaDTO {
    private Integer bitacoraId;
    private Instant fechaMov;
    private Boolean politica;
    private Integer folioCita;
    private String estatus;
    private String medico;
}
