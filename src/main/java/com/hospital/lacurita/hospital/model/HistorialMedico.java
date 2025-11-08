package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
public class HistorialMedico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HistorialMedicoId", nullable = false)
    private Integer id;

    @Size(max = 3)
    @NotNull
    @Column(name = "TipoSangre", nullable = false, length = 3)
    private String tipoSangre;

    @NotNull
    @Column(name = "Peso", nullable = false, precision = 5, scale = 2)
    private BigDecimal peso;

    @NotNull
    @Column(name = "Estatura", nullable = false, precision = 3, scale = 2)
    private BigDecimal estatura;

}