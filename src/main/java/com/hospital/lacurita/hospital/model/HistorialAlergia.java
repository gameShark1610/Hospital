package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "HistorialAlergias")
public class HistorialAlergia {
    @EmbeddedId
    private HistorialAlergiaId id;

    @MapsId("historialMedicoId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "HistorialMedicoId", nullable = false)
    private HistorialMedico historialMedico;

    @MapsId("alergiaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "AlergiaId", nullable = false)
    private Alergia alergia;

}