package com.hospital.lacurita.hospital.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@Entity
public class HorarioEmpleado {
    @Id
    @Column(name = "HorarioEmpleadoId", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "HoraEntrada", nullable = false)
    private LocalTime horaEntrada;

    @NotNull
    @Column(name = "HoraSalida", nullable = false)
    private LocalTime horaSalida;

    @NotNull
    @Column(name = "DescansoIni", nullable = false)
    private LocalTime descansoIni;

    @NotNull
    @Column(name = "DescansoFin", nullable = false)
    private LocalTime descansoFin;

    @Size(max = 20)
    @NotNull
    @Column(name = "Turno", nullable = false, length = 20)
    private String turno;

}