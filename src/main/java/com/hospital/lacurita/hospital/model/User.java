package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;

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

    public TipoUsuario getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(TipoUsuario tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

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
