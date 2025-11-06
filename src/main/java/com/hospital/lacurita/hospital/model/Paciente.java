package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Paciente")
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pacienteId;

    @OneToOne
    @JoinColumn(name = "UsuarioId")
    private User user;

}
