package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Usuario")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UsuarioId", insertable = false, updatable = false)
    private int usuarioId;

    @Column(name = "Usuario", nullable = false, length = 100)
    private String correo;

    @Column(name = "Contraseña", nullable = false, length = 100)
    private String password;

    @OneToOne
    @JoinColumn(name = "TipoUsuarioId")
    private TipoUsuario tipoUsuario;

    @OneToOne
    @JoinColumn(name = "PersonaId")
    private Persona persona;
}
