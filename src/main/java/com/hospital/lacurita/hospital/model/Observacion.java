package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Observacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ObservacionId", nullable = false)
    private Integer id;

    @Size(max = 200)
    @NotNull
    @Column(name = "Observacion", nullable = false, length = 200)
    private String observacion;

}