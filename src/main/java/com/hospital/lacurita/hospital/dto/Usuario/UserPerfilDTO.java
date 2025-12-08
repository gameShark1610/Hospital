package com.hospital.lacurita.hospital.dto.Usuario;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserPerfilDTO {
    String nombre;
    String apellidoPaterno;
    String apellidoMaterno;
    String correo;
    LocalDate fechaNacimiento;
    String genero;
    String telefono;

}
