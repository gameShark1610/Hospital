package com.hospital.lacurita.hospital.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class HistorialMedico {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int historialMedicoId;
    private String tipoSangre;
    private double peso;
    private double estatura;
}
