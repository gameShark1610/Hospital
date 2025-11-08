package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class RecetaMedicamento {
    @EmbeddedId
    private RecetaMedicamentoId id;

    @MapsId("folio")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Folio", nullable = false)
    private Receta folio;

    @MapsId("medicamentoId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MedicamentoId", nullable = false)
    private Medicamento medicamento;

}