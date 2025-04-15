package com.gambler99.ebay_clone.dto;

import lombok.Data;

import java.util.List;

@Data
public class JwtResponseDTO {
    // take token, type = "Bearer",id , username, email, list of roles
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private List<String> roles;

    public JwtResponseDTO(String token, Long id, String username, String email, List<String> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}
