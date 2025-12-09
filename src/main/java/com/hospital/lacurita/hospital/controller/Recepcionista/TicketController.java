package com.hospital.lacurita.hospital.controller.Recepcionista;

import com.hospital.lacurita.hospital.dto.Recepcionista.TicketDTO;
import com.hospital.lacurita.hospital.service.TicketService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recepcionista/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<Integer> crearTicket(@RequestBody TicketDTO ticketDTO) {
        Integer ticketId = ticketService.crearTicket(ticketDTO);
        return ResponseEntity.ok(ticketId);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> descargarPdf(@PathVariable Integer id) {
        byte[] pdfBytes = ticketService.generarPdf(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ticket_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
