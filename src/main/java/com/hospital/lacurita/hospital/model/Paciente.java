package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Paciente")
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pacienteId;

    @OneToOne
    @JoinColumn(name = "UsuarioId")
    private User user;

    @OneToOne
    @JoinColumn(name = "HistorialMedicoId")
    private HistorialMedico historialMedico;
}
