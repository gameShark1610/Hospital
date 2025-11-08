package com.hospital.lacurita.hospital.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@Entity
public class HorarioPreestablecido {
    @Id
    @Column(name = "IdHorario", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "HorarioIni", nullable = false)
    private LocalTime horarioIni;

    @NotNull
    @Column(name = "HorarioFin", nullable = false)
    private LocalTime horarioFin;

}