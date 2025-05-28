package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.exception.IncorrectPasswordException;
import com.gambler99.ebay_clone.entity.Role;
import com.gambler99.ebay_clone.repository.UserRepository;
import com.gambler99.ebay_clone.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gambler99.ebay_clone.dto.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public User findOrCreateGoogleUser(String email, String googleId, String name, String address) {
        User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> userRepository.findByEmail(email).orElse(null));

        if (user == null) {
            // Assign default role (e.g., ROLE_USER)
            Role defaultRole = roleRepository.findByRoleName("ROLE_BUYER")
                    .orElseThrow(() -> new RuntimeException("Default role not found"));

                    if (address == null) {
                        address = email; // Set to email if address is not provided
                        
                    }
            user = User.builder()
                    .username(email)
                    .email(email)
                    .googleId(googleId)
                    .address(address)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .roles(Collections.singleton(defaultRole))
                    .build();
            userRepository.save(user);
        } else if (user.getGoogleId() == null) {
            user.setGoogleId(googleId);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
        return user;
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserProfileDTO getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setAddress(user.getAddress());
        dto.setPhoneNumber(user.getPhoneNumber());
        return dto;
    }

    public UserProfileDTO updateProfile(String username, UpdateUserProfileDTO updateDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmail(updateDto.email());
        user.setAddress(updateDto.address());
        user.setPhoneNumber(updateDto.phoneNumber());
        userRepository.save(user);
        return getProfile(username);
    }

    public void changePassword(String username, ChangePasswordDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPasswordHash())) {
            throw new IncorrectPasswordException("Old password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }
}