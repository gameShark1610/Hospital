package com.hospital.lacurita.hospital.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "TicketDetalle", schema = "dbo")
public class TicketDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DetalleId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Folio", nullable = false)
    private Ticket folio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MedicamentoId")
    private Medicamento medicamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServicioId")
    private Servicio servicio;

    @NotNull
    @Column(name = "Cantidad", nullable = false)
    private Integer cantidad;

}