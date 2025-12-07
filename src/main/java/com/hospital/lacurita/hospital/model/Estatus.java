package com.hospital.lacurita.hospital.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
public class Estatus {
    @Id
    @Column(name = "EstatusId", nullable = false)
    private Integer id;

    @Size(max = 20)
    @NotNull
    @Column(name = "Estatus", nullable = false, length = 20)
    private String estatus;

    @Column(name = "Politica")
    private Integer politica;

    //@OneToMany(mappedBy = "estatus")
    //private Set<Cita> citas = new LinkedHashSet<>();

}