package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.entity.Role;
import com.gambler99.ebay_clone.repository.UserRepository;
import com.gambler99.ebay_clone.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public User findOrCreateGoogleUser(String email, String googleId, String name) {
        User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> userRepository.findByEmail(email).orElse(null));

        if (user == null) {
            // Assign default role (e.g., ROLE_USER)
            Role defaultRole = roleRepository.findByRoleName("ROLE_BUYER")
                    .orElseThrow(() -> new RuntimeException("Default role not found"));

            user = User.builder()
                    .username(email)
                    .email(email)
                    .googleId(googleId)
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
}