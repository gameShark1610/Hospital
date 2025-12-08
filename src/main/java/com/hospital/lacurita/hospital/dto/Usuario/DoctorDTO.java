package com.hospital.lacurita.hospital.dto.Usuario;

import lombok.Data;

@Data
public class DoctorDTO {
    private Integer id;
    private String nombreCompleto;
    private String especialidad;
    private String consultorio;

    public DoctorDTO(Integer id, String nombreCompleto) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
    }

    public DoctorDTO(Integer id, String nombreCompleto, String especialidad, String consultorio) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.especialidad = especialidad;
        this.consultorio = consultorio;
    }
}
