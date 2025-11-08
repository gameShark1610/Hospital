package com.hospital.lacurita.hospital.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
public class Servicio {
    @Id
    @Column(name = "ServicioId", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "Servicio", nullable = false, length = 50)
    private String servicio;

    @NotNull
    @Column(name = "Precio", nullable = false)
    private BigDecimal precio;

}