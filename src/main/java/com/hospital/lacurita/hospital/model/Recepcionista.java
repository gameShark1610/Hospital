package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Recepcionista {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RecepcionistaId", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "NumeroExtension", nullable = false)
    private Integer numeroExtension;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "EmpleadoId", nullable = false)
    private Empleado empleado;

}