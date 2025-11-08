package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
public class Cita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FolioCita", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "Fecha", nullable = false)
    private Instant fecha;

    @NotNull
    @Column(name = "FechaAgendada", nullable = false)
    private LocalDate fechaAgendada;

    @NotNull
    @Column(name = "Estatus", nullable = false)
    private Boolean estatus = false;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "PacienteId", nullable = false)
    private Paciente paciente;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "DoctorId", nullable = false)
    private Doctor doctor;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "HorarioId", nullable = false)
    private HorarioPreestablecido horario;

}