package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;

@Entity
public class TipoUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tipoUsuarioId;

    private String tipoUsuario;
}
