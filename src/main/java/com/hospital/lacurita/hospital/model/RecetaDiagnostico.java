package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class RecetaDiagnostico {
    @EmbeddedId
    private RecetaDiagnosticoId id;

    @MapsId("folio")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Folio", nullable = false)
    private Receta folio;

    @MapsId("diagnosticoId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "DiagnosticoId", nullable = false)
    private Diagnostico diagnostico;

}