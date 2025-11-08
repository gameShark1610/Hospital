package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class Persona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PersonaId", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "Nombre", nullable = false, length = 50)
    private String nombre;

    @Size(max = 50)
    @NotNull
    @Column(name = "Paterno", nullable = false, length = 50)
    private String paterno;

    @Size(max = 50)
    @Column(name = "Materno", length = 50)
    private String materno;

    @NotNull
    @Column(name = "FechaNacim", nullable = false)
    private LocalDate fechaNacim;

}