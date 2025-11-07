
package com.hospital.lacurita.hospital.dto;

public class LoginRequest {
    private String correo;
    private String password;

    // Getters and Setters
    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}