package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
public class BitacoraHistorial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BitacoraHistorialId", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "FechaMov", nullable = false)
    private Instant fechaMov;

    @NotNull
    @Column(name = "FechaCita", nullable = false)
    private LocalDate fechaCita;

    @Size(max = 50)
    @NotNull
    @Column(name = "HorarioCita", nullable = false, length = 50)
    private String horarioCita;

    @Size(max = 20)
    @NotNull
    @Column(name = "Estatus", nullable = false, length = 20)
    private String estatus;

    @Size(max = 50)
    @NotNull
    @Column(name = "Especialidad", nullable = false, length = 50)
    private String especialidad;

    @NotNull
    @Column(name = "Consultorio", nullable = false)
    private Integer consultorio;

    @NotNull
    @Column(name = "PacienteId", nullable = false)
    private Integer pacienteId;

    @Column(name = "Folio")
    private Integer folio;

    @NotNull
    @Column(name = "DoctorId", nullable = false)
    private Integer doctorId;

    @Size(max = 200)
    @Column(name = "Diagnostico", length = 200)
    private String diagnostico;

}