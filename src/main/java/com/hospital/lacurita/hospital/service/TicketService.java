package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.Recepcionista.TicketDTO;
import com.hospital.lacurita.hospital.dto.Recepcionista.TicketDetalleDTO;
import com.hospital.lacurita.hospital.model.*;
import com.hospital.lacurita.hospital.repository.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.stream.Stream;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketDetalleRepository ticketDetalleRepository;
    private final MedicamentoRepository medicamentoRepository;
    private final ServicioRepository servicioRepository; // Check if exists
    private final EmpleadoRepository empleadoRepository; // Context to set who created it? Or null.

    public TicketService(TicketRepository ticketRepository,
            TicketDetalleRepository ticketDetalleRepository,
            MedicamentoRepository medicamentoRepository,
            ServicioRepository servicioRepository,
            EmpleadoRepository empleadoRepository) {
        this.ticketRepository = ticketRepository;
        this.ticketDetalleRepository = ticketDetalleRepository;
        this.medicamentoRepository = medicamentoRepository;
        this.servicioRepository = servicioRepository;
        this.empleadoRepository = empleadoRepository;
    }

    @Transactional
    public Integer crearTicket(TicketDTO dto) {
        Ticket ticket = new Ticket();
        ticket.setNombreCliente(dto.getNombreCliente());
        ticket.setFecha(Instant.now());
        // Employee logic omitted for simplicity or can be added if we have current user
        // context

        Ticket savedTicket = ticketRepository.save(ticket);

        for (TicketDetalleDTO detalleDTO : dto.getDetalles()) {
            TicketDetalle detalle = new TicketDetalle();
            detalle.setFolio(savedTicket);
            detalle.setCantidad(detalleDTO.getCantidad());

            if ("medicamento".equalsIgnoreCase(detalleDTO.getTipo())) {
                Medicamento med = medicamentoRepository.findById(detalleDTO.getIdItem())
                        .orElseThrow(
                                () -> new RuntimeException("Medicamento no encontrado: " + detalleDTO.getIdItem()));

                // Decrement stock
                if (med.getCantidad() < detalleDTO.getCantidad()) {
                    throw new RuntimeException("Stock insuficiente para: " + med.getNombreMed());
                }
                med.setCantidad(med.getCantidad() - detalleDTO.getCantidad());
                if (med.getCantidad() == 0)
                    med.setStock(false);
                medicamentoRepository.save(med);

                detalle.setMedicamento(med);
            } else if ("servicio".equalsIgnoreCase(detalleDTO.getTipo())) {
                // If ServicioRepository exists
                Servicio serv = servicioRepository.findById(detalleDTO.getIdItem())
                        .orElseThrow(() -> new RuntimeException("Servicio no encontrado: " + detalleDTO.getIdItem()));
                detalle.setServicio(serv);
            }

            ticketDetalleRepository.save(detalle);
        }

        return savedTicket.getId();
    }

    public byte[] generarPdf(Integer ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));

        // Fetch details
        // TicketDetalle logic via repository query or mappedBy
        java.util.List<TicketDetalle> detalles = ticket.getTicketDetalles().stream().toList();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Header
            Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph header = new Paragraph("Hospital La Curita - Ticket de Venta", fontHeader);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Folio: " + ticket.getId()));
            document.add(new Paragraph("Fecha: " + ticket.getFecha().toString()));
            document.add(new Paragraph("Cliente: " + ticket.getNombreCliente()));
            document.add(new Paragraph(" "));

            // Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            Stream.of("Concepto", "Cant", "Precio Unit", "Total")
                    .forEach(columnTitle -> {
                        PdfPCell headerCell = new PdfPCell();
                        headerCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        headerCell.setPhrase(new Phrase(columnTitle));
                        table.addCell(headerCell);
                    });

            BigDecimal totalGeneral = BigDecimal.ZERO;

            for (TicketDetalle det : detalles) {
                String concepto = "";
                BigDecimal precio = BigDecimal.ZERO;

                if (det.getMedicamento() != null) {
                    concepto = det.getMedicamento().getNombreMed();
                    precio = det.getMedicamento().getPrecio();
                } else if (det.getServicio() != null) {
                    concepto = det.getServicio().getServicio();
                    precio = det.getServicio().getPrecio();
                }

                BigDecimal totalLinea = precio.multiply(BigDecimal.valueOf(det.getCantidad()));
                totalGeneral = totalGeneral.add(totalLinea);

                table.addCell(concepto);
                table.addCell(String.valueOf(det.getCantidad()));
                table.addCell("$" + precio);
                table.addCell("$" + totalLinea);
            }

            document.add(table);
            document.add(new Paragraph(" "));

            Paragraph totalP = new Paragraph("TOTAL: $" + totalGeneral,
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
            totalP.setAlignment(Element.ALIGN_RIGHT);
            document.add(totalP);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF", e);
        }
    }
}
