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

            // Colors and Fonts
            Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, BaseColor.DARK_GRAY);
            Font fontSubHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.GRAY);
            Font fontBody = FontFactory.getFont(FontFactory.HELVETICA, 10);
            Font fontTableHead = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);

            // Header Section
            Paragraph header = new Paragraph("HOSPITAL LA CURITA", fontHeader);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);

            Paragraph subHeader = new Paragraph("Ticket de Compra", fontSubHeader);
            subHeader.setAlignment(Element.ALIGN_CENTER);
            subHeader.setSpacingAfter(20f);
            document.add(subHeader);

            // Info Section
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(20f);

            PdfPCell cellLeft = new PdfPCell();
            cellLeft.setBorder(Rectangle.NO_BORDER);
            cellLeft.addElement(new Paragraph("Folio: #" + ticket.getId(), fontBody));
            cellLeft.addElement(new Paragraph("Cliente: " + ticket.getNombreCliente(), fontBody));
            infoTable.addCell(cellLeft);

            PdfPCell cellRight = new PdfPCell();
            cellRight.setBorder(Rectangle.NO_BORDER);
            cellRight.setHorizontalAlignment(Element.ALIGN_RIGHT);
            // Format Instant to nicer string
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter
                    .ofPattern("dd/MM/yyyy HH:mm")
                    .withZone(java.time.ZoneId.systemDefault());
            cellRight.addElement(new Paragraph("Fecha: " + formatter.format(ticket.getFecha()), fontBody));
            infoTable.addCell(cellRight);

            document.add(infoTable);

            // Details Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 4f, 1f, 2f, 2f });
            table.setSpacingBefore(10f);

            Stream.of("Concepto", "Cant.", "Precio Unit.", "Total").forEach(columnTitle -> {
                PdfPCell headerCell = new PdfPCell();
                headerCell.setBackgroundColor(new BaseColor(60, 141, 188)); // Hospital Blue
                headerCell.setPadding(6f);
                headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                headerCell.setPhrase(new Phrase(columnTitle, fontTableHead));
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

                addCell(table, concepto, Element.ALIGN_LEFT);
                addCell(table, String.valueOf(det.getCantidad()), Element.ALIGN_CENTER);
                addCell(table, "$" + String.format("%.2f", precio), Element.ALIGN_RIGHT);
                addCell(table, "$" + String.format("%.2f", totalLinea), Element.ALIGN_RIGHT);
            }

            document.add(table);
            document.add(new Paragraph(" "));

            // Total Section
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(100);
            totalTable.setWidths(new float[] { 7f, 3f });

            PdfPCell emptyCell = new PdfPCell(new Phrase(""));
            emptyCell.setBorder(Rectangle.NO_BORDER);
            totalTable.addCell(emptyCell);

            PdfPCell totalCell = new PdfPCell(new Phrase("TOTAL: $" + String.format("%.2f", totalGeneral),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.BLACK)));
            totalCell.setBorder(Rectangle.TOP);
            totalCell.setPaddingTop(10f);
            totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalTable.addCell(totalCell);

            document.add(totalTable);

            // Footer
            Paragraph footer = new Paragraph("¡Gracias por su preferencia!",
                    FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, BaseColor.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(50f);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF", e);
        }
    }

    private void addCell(PdfPTable table, String text, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA, 10)));
        cell.setPadding(5f);
        cell.setHorizontalAlignment(alignment);
        cell.setBorderColor(BaseColor.LIGHT_GRAY);
        table.addCell(cell);
    }
}
