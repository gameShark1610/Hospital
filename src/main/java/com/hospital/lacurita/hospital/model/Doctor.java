package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DoctorId", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "NumCedula", nullable = false)
    private Integer numCedula;

    @NotNull
    @Column(name = "Habilitado", nullable = false)
    private Boolean habilitado;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "EspecialidadId", nullable = false)
    private Especialidad especialidad;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ConsultorioId", nullable = false)
    private Consultorio consultorio;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "EmpleadoId", nullable = false)
    private Empleado empleado;

}