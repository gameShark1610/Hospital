package com.hospital.lacurita.hospital.dto;

import lombok.Data;

@Data
public class HorariosRequest {
    private Integer id;
    private String Horario;

    public HorariosRequest(Integer id, String horario) {
        this.id = id;
        Horario = horario;
    }
}
