package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class HorarioDia {
    @EmbeddedId
    private HorarioDiaId id;

    @MapsId("horarioEmpleadoId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "HorarioEmpleadoId", nullable = false)
    private HorarioEmpleado horarioEmpleado;

    @MapsId("diaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "DiaId", nullable = false)
    private Dia dia;

}