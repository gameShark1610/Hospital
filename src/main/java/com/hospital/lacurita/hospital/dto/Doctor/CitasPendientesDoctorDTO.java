package com.hospital.lacurita.hospital.dto.Doctor;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class CitasPendientesDoctorDTO {
    private Integer doctorId;
    private String nombreDoctor;
    private String nombrePaciente;
    private Date fechaAgendada;
    private String horario;
    private String telefono;
    private String estatus;
    private String numConsultorio;

    public CitasPendientesDoctorDTO(Integer doctorId, String nombreDoctor, String nombrePaciente, Date fechaAgendada, String horario, String telefono, String numConsultorio) {
        this.doctorId = doctorId;
        this.nombreDoctor = nombreDoctor;
        this.nombrePaciente = nombrePaciente;
        this.fechaAgendada = fechaAgendada;
        this.horario = horario;
        this.telefono = telefono;
        this.numConsultorio = numConsultorio;
    }
}
