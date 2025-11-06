package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int usuarioId;

    private String correo;
    private String password;


    @OneToOne
    @JoinColumn(name = "TipoUsuarioId")
    private TipoUsuario tipoUsuario;

    @OneToOne
    @JoinColumn(name = "PersonaId")
    private Persona persona;

    public int getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


}
