package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TipoUsuario")
public class TipoUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tipoUsuarioId;

    @Column(name = "TipoUsuario", nullable = false, length = 100)
    private String tipoUsuario;
}
