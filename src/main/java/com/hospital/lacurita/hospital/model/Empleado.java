package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EmpleadoId", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "Sueldo", nullable = false)
    private BigDecimal sueldo;

    @Size(max = 18)
    @NotNull
    @Column(name = "Curp", nullable = false, length = 18)
    private String curp;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "UsuarioId", nullable = false)
    private Usuario usuario;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "HorarioEmpleadoId", nullable = false)
    private HorarioEmpleado horarioEmpleado;

}