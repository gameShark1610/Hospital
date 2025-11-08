package com.hospital.lacurita.hospital.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Consultorio {
    @Id
    @Column(name = "ConsultorioId", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "NumConsultorio", nullable = false)
    private Integer numConsultorio;

}