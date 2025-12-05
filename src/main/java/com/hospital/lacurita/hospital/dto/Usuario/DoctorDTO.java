package com.hospital.lacurita.hospital.dto.Usuario;

import lombok.Data;

@Data
public class DoctorDTO {
    private Integer id;
    private String nombreCompleto;

    public DoctorDTO(Integer id, String nombreCompleto) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
    }
}
