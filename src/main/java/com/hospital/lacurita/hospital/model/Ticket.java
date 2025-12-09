package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "Ticket", schema = "dbo")
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmpleadoId")
    private Empleado empleado;

    @OneToMany(mappedBy = "folio")
    private Set<TicketDetalle> ticketDetalles = new LinkedHashSet<>();

}