package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.JwtResponseDTO;
import com.gambler99.ebay_clone.dto.LoginRequestDTO;
import com.gambler99.ebay_clone.dto.MessageResponseDTO;
import com.gambler99.ebay_clone.dto.SignupRequestDTO;
import com.gambler99.ebay_clone.entity.Role;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.exception.EmailAlreadyExistsException;
import com.gambler99.ebay_clone.exception.RoleNotFoundException;
import com.gambler99.ebay_clone.exception.UsernameAlreadyExistsException;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Transactional
    public void registerUser(SignupRequestDTO signupRequestDTO) {
        // Check if username exists
        if (userRepository.existsByUsername(signupRequestDTO.getUsername())) {
            // Throw specific exception
            throw new UsernameAlreadyExistsException("Error: Username is already taken!");
        }

        // Check if email exists
        if (userRepository.existsByEmail(signupRequestDTO.getEmail())) {
            // Throw specific exception
            throw new EmailAlreadyExistsException("Error: Email is already in use!");
        }

        // Create a new User object and set its properties
        User user = User.builder()
                .username(signupRequestDTO.getUsername())
                .email(signupRequestDTO.getEmail())
                .passwordHash(passwordEncoder.encode(signupRequestDTO.getPassword()))
                .build();

        // Set roles for the user
        Set<String> strRoles = signupRequestDTO.getRoles();
        Set<Role> roles = new HashSet<>();

        final String DEFAULT_ROLE_NAME = "ROLE_BUYER";

        if (strRoles == null || strRoles.isEmpty()) {
            Role buyerRole = roleRepository.findByRoleName(DEFAULT_ROLE_NAME)
                    .orElseThrow(() -> new RoleNotFoundException("Error: Default role " + DEFAULT_ROLE_NAME + " not found."));
            roles.add(buyerRole);
        } else {
            strRoles.forEach(roleNameInput -> {
                String roleNameToFind = roleNameInput.startsWith("ROLE_") ? roleNameInput : "ROLE_" + roleNameInput;
                Role role = roleRepository.findByRoleName(roleNameToFind)
                        .orElseThrow(() -> new RoleNotFoundException("Error: Role " + roleNameToFind + " not found."));
                roles.add(role);
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

    }

    public JwtResponseDTO authenticateUser(LoginRequestDTO loginRequestDTO) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getUsername(),
                        loginRequestDTO.getPassword()
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