package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class Receta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Folio", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "Fecha", nullable = false)
    private LocalDate fecha;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "FolioCita", nullable = false)
    private Cita folioCita;

}