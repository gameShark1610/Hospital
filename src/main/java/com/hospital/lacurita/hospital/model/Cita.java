package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

@Data
@Entity
@Table(name = "Cita")
public class Cita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int folioCita;

    @Column(name = "Fecha", nullable = false, length = 100)
    LocalDate fecha;

    @Column(name = "FechaAgendada", nullable = false, length = 100)
    LocalDate fechaAgendada;

    @Column(name = "Estatus", nullable = false, length = 100)
    boolean estatus;

    @Column(name = "Hora", nullable = false, length = 100)
    LocalTime hora;

    @ManyToOne
    @JoinColumn(name = "PacienteId")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "PacienteId")
    private Doctor doctor;

}
