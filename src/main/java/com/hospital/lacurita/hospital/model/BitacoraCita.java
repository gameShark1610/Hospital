package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "BitacoraCita")
public class BitacoraCita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BitacoraCitaId", nullable = false)
    private Integer id;

    @Column(name = "FechaMov", nullable = false)
    private Instant fechaMov;

    @Column(name = "FechaCita", nullable = false)
    private LocalDate fechaCita;

    @Column(name = "Costo", nullable = false)
    private BigDecimal costo;

    @Column(name = "MontoDevuelto")
    private BigDecimal montoDevuelto;

    @Column(name = "Politica", nullable = false)
    private Boolean politica;

    @Column(name = "FolioCita", nullable = false)
    private Integer folioCita;

    @Column(name = "Estatus", nullable = false, length = 20)
    private String estatus;

    @Column(name = "Especialidad", nullable = false, length = 50)
    private String especialidad;
}