package com.hospital.lacurita.hospital.dto;


public record LoginResponseDTO(
        String message,
        int tipoUsuario


) {
    @Override
    public String message() {
        return message;
    }

    @Override
    public int tipoUsuario() {
        return tipoUsuario;
    }
}
