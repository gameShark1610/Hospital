package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class RecetaObservacion {
    @EmbeddedId
    private RecetaObservacionId id;

    @MapsId("folio")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Folio", nullable = false)
    private Receta folio;

    @MapsId("observacionId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ObservacionId", nullable = false)
    private Observacion observacion;

}