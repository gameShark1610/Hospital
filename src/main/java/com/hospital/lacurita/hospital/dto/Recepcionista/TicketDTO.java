package com.hospital.lacurita.hospital.dto.Recepcionista;

import lombok.Data;
import java.util.List;

@Data
public class TicketDTO {
    private String nombreCliente;
    private String medicoAsignado; // Can be ID or Name, better ID if logic requires
    private String tipoConsulta;
    private List<TicketDetalleDTO> detalles;
}
