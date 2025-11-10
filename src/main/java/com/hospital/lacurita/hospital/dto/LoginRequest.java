
package com.hospital.lacurita.hospital.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String usuario;
    private String password;
}