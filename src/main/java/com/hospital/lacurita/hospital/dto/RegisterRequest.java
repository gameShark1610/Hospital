package com.hospital.lacurita.hospital.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    //Usuario
    private String correo;
    private String password;
    private int tipoUsuarioId;

    //Persona
    private String nombre;
    private String paterno;
    private String materno;
    private LocalDate fechaNacim;
}