package com.hospital.lacurita.hospital.dto.Usuario;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UserPerfilDTO {
    String nombre;
    String apellidos;
    String email;
    LocalDate fechaNacimiento;
    String genero;

    //Datos medicos
    String tipoSangre;
    BigDecimal altura;
    String alergias;
    String enfermedadesCronicas;

}
