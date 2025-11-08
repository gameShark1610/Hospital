package com.hospital.lacurita.hospital.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Alergia {
    @Id
    @Column(name = "AlergiaId", nullable = false)
    private Integer id;

    @Size(max = 50)
    @Column(name = "Alergia", length = 50)
    private String alergia;

}