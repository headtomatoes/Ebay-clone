package com.gambler99.ebay_clone.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private String username;
    private String email;
    private String address;
    private String phoneNumber;
}