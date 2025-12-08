package com.hospital.lacurita.hospital.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
public class BitacoraCita {
    @Id
    @Column(name = "BitacoraCitaId", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "FechaMov", nullable = false)
    private Instant fechaMov;

    @NotNull
    @Column(name = "FechaCita", nullable = false)
    private LocalDate fechaCita;

    @NotNull
    @Column(name = "Costo", nullable = false)
    private BigDecimal costo;

    @Column(name = "MontoDevuelto")
    private BigDecimal montoDevuelto;

    @NotNull
    @Column(name = "Politica", nullable = false)
    private Boolean politica = false;

    @NotNull
    @Column(name = "FolioCita", nullable = false)
    private Integer folioCita;

    @Size(max = 20)
    @NotNull
    @Column(name = "Estatus", nullable = false, length = 20)
    private String estatus;

    @Size(max = 50)
    @NotNull
    @Column(name = "Especialidad", nullable = false, length = 50)
    private String especialidad;

}