package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Folio", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "NombreCliente", nullable = false, length = 50)
    private String nombreCliente;

    @NotNull
    @Column(name = "Fecha", nullable = false)
    private Instant fecha;

    @NotNull
    @Column(name = "Cantidad", nullable = false)
    private Integer cantidad;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MedicamentoId", nullable = false)
    private Medicamento medicamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServicioId")
    private Servicio servicio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmpleadoId")
    private Empleado empleado;

}