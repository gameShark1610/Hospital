package com.hospital.lacurita.hospital.dto.Recepcionista;

import lombok.Data;

@Data
public class TicketDetalleDTO {
    private String tipo; // "servicio" or "medicamento"
    private Integer idItem; // ServiceID or MedicamentoID
    private Integer cantidad;
    private Double precio; // Optional, can fetch from DB
}
