package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.Usuario.HorariosRequest;
import com.hospital.lacurita.hospital.repository.HorarioPreestablecidoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HorarioPreestablecidoService {
    private final HorarioPreestablecidoRepository horarioPreestablecidoRepository;

    public HorarioPreestablecidoService(HorarioPreestablecidoRepository horarioPreestablecidoRepository) {
        this.horarioPreestablecidoRepository = horarioPreestablecidoRepository;
    }


    public List<HorariosRequest> obtenerHorariosDisponibles(LocalDate fechaAgendada, int doctorId) {

        List<Object[]> resultados = horarioPreestablecidoRepository.findHorariosDisponibles(fechaAgendada, doctorId);

        return resultados.stream()
                .map(row -> new HorariosRequest(
                        (Integer) row[0],         // IdHorario
                        (String) row[1]           // HorarioDisponible
                ))
                .collect(Collectors.toList());

    }

}
