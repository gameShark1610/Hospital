package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Dia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DiaId", nullable = false)
    private Integer id;

    @Size(max = 20)
    @NotNull
    @Column(name = "Dia", nullable = false, length = 20)
    private String dia;

}