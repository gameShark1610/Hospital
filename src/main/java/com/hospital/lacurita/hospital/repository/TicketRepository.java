package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {
}
