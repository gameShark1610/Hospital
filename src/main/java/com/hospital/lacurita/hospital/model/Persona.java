package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
@Data
@Entity
@Table(name = "Persona")
public class Persona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int personaId;

    @Column(name = "Nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "Paterno", nullable = false, length = 100)
    private String apellidoPaterno;

    @Column(name = "Materno", nullable = false, length = 100)
    private String apellidoMaterno;

    @Column(name = "FechaNac", nullable = false, length = 100)
    private Date FechaNacimiento;
}
