package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.JwtResponseDTO;
import com.gambler99.ebay_clone.dto.LoginRequestDTO;
import com.gambler99.ebay_clone.dto.MessageResponseDTO;
import com.gambler99.ebay_clone.dto.SignupRequestDTO;
import com.gambler99.ebay_clone.entity.Role;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.repository.RoleRepository;
import com.gambler99.ebay_clone.repository.UserRepository;

import com.gambler99.ebay_clone.security.JwtTokenProvider;
import com.gambler99.ebay_clone.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // wait for those to be implemented by the team
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Transactional
    public MessageResponseDTO registerUser(SignupRequestDTO signupRequest) {
        // Check if username exists using the UserRepository
        if(userRepository.existsByUsername(signupRequest.getUsername())) {
            return new MessageResponseDTO("Error: Username is already taken!");
        }

        // Check if email exists using the UserRepository
        if(userRepository.existsByEmail(signupRequest.getEmail())) {
            return new MessageResponseDTO("Error: Email is already in use!");
        }

        // Create a new User object and set its properties
        User user = User.builder()
                .username(signupRequest.getUsername())
                .email(signupRequest.getEmail())
                .passwordHash(passwordEncoder.encode(signupRequest.getPassword()))
                .build();

        // Set roles for the user
        Set<String> strRoles = signupRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            // If no roles specified, assign default BUYER role
            Role buyerRole = roleRepository.findByRoleName("BUYER")
                    .orElseThrow(() -> new RuntimeException("Error: Default BUYER role not found."));
            roles.add(buyerRole);
        } else {
            // Process requested roles
            strRoles.forEach(roleName -> {
                Role role = roleRepository.findByRoleName(roleName)
                        .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " not found."));
                roles.add(role);
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return new MessageResponseDTO("User registered successfully!");
    }

    public JwtResponseDTO authenticateUser(LoginRequestDTO loginRequest) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String jwt = jwtTokenProvider.generateJwtToken(authentication);

        // Get user details from authentication
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Extract roles from authorities
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Return JWT response with token, user details, and roles
        return new JwtResponseDTO(
                jwt,
                userDetails.getUserId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles
        );
    }

}