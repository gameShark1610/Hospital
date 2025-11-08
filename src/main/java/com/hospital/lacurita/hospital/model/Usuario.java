package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UsuarioId", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "Usuario", nullable = false, length = 50)
    private String usuario;

    @Size(max = 50)
    @NotNull
    @Column(name = "\"Contraseña\"", nullable = false, length = 50)
    private String contraseña;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "TipoUsuarioId", nullable = false)
    private TipoUsuario tipoUsuario;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "PersonaId", nullable = false)
    private Persona persona;

}