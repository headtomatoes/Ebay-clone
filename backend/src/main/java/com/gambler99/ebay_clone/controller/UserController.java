package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.*;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.service.UserService;
import com.gambler99.ebay_clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // Helper to get current username
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    // Get current user profile
    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getProfile() {
        String username = getCurrentUsername();
        UserProfileDTO dto = userService.getProfile(username);
        return ResponseEntity.ok(dto);
    }

    // Update profile (email, address, phone)
    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateProfile(@RequestBody UpdateUserProfileDTO updateDto) {
        String username = getCurrentUsername();
        UserProfileDTO dto = userService.updateProfile(username, updateDto);
        return ResponseEntity.ok(dto);
    }

    // Change password
    @PostMapping("/change-password")
    public ResponseEntity<MessageResponseDTO> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO) {
        String username = getCurrentUsername();
        userService.changePassword(username, changePasswordDTO);
        return ResponseEntity.ok(new MessageResponseDTO("Password changed successfully!"));
    }
}