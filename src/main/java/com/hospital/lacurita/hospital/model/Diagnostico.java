package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Diagnostico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DiagnosticoId", nullable = false)
    private Integer id;

    @Size(max = 200)
    @NotNull
    @Column(name = "Diagnostico", nullable = false, length = 200)
    private String diagnostico;

}