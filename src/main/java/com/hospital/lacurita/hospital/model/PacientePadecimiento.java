package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class PacientePadecimiento {
    @EmbeddedId
    private PacientePadecimientoId id;

    @MapsId("padecimientoPrevioId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "PadecimientoPrevioId", nullable = false)
    private PadecimientoPrevio padecimientoPrevio;

    @MapsId("pacienteId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "PacienteId", nullable = false)
    private Paciente paciente;

}