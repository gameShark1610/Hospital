package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.CitaRequest;
import com.hospital.lacurita.hospital.model.Cita;
import com.hospital.lacurita.hospital.repository.CitaRepository;
import com.hospital.lacurita.hospital.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CitaService {

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    public Cita crearCita(CitaRequest citaRequest){

        /* Check if cita is possible
        if (citaRepository.findByCorreo(registerRequest.getCorreo()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }*/



        Cita cita = new Cita();
        cita.setFecha(citaRequest.getFecha());
        cita.setFechaAgendada(citaRequest.getFechaAgendad());
        //cita.setHorario();
        //Obtener el idPaciente
        //cita.set(citaRequest.getFecha());

        return citaRepository.save(cita);
    }


}
