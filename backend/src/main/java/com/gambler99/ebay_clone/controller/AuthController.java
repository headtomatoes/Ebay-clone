package com.gambler99.ebay_clone.controller;


import com.gambler99.ebay_clone.dto.JwtResponseDTO;
import com.gambler99.ebay_clone.dto.LoginRequestDTO;
import com.gambler99.ebay_clone.dto.MessageResponseDTO;
import com.gambler99.ebay_clone.dto.SignupRequestDTO;
import com.gambler99.ebay_clone.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.gambler99.ebay_clone.service.UserService;
import com.gambler99.ebay_clone.security.JwtTokenProvider;
import com.gambler99.ebay_clone.security.UserDetailsImpl;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600) // Allow requests from all origins (adjust for production)
@RestController //methods return domain objects instead of views
@RequestMapping("/api/auth") // Base URL for authentication endpoints
public class AuthController {
    private final AuthService authService;

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;


    // @Autowired //Constructor Injection
    // public AuthController(AuthService authService) {
    //     this.authService = authService;
    // }

    @Autowired
    public AuthController(AuthService authService, UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.authService = authService;
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping("/oauth2/success")
    public void oauth2Success(Authentication authentication, HttpServletResponse response) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String googleId = oAuth2User.getAttribute("sub");
        String name = oAuth2User.getAttribute("name");
        String address = oAuth2User.getAttribute("address"); // Extract address if available
    
        // Find or create user
        var user = userService.findOrCreateGoogleUser(email, googleId, name, address);
    
        // Build UserDetailsImpl for JWT
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
    
        // Generate JWT token
        String token = jwtTokenProvider.generateJwtToken(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                )
        );
    
        String roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
    
        // Redirect to frontend with token and user info
        String redirectUrl = String.format(
            "http://localhost:5173/oauth2/redirect?token=%s&userId=%s&username=%s&email=%s&roles=%s",
            token,
            user.getUserId(),
            user.getUsername(),
            user.getEmail(),
            roles
        );
        response.sendRedirect(redirectUrl);
    }
    // public ResponseEntity<?> oauth2Success(Authentication authentication) {
    //     OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    //     String email = oAuth2User.getAttribute("email");
    //     String googleId = oAuth2User.getAttribute("sub");
    //     String name = oAuth2User.getAttribute("name");

    //     // Find or create user
    //     var user = userService.findOrCreateGoogleUser(email, googleId, name);

    //     // Build UserDetailsImpl for JWT
    //     UserDetailsImpl userDetails = UserDetailsImpl.build(user);

    //     // Generate JWT token
    //     String token = jwtTokenProvider.generateJwtToken(
    //             new Authentication() {
    //                 @Override
    //                 public List<? extends GrantedAuthority> getAuthorities() {
    //                     return userDetails.getAuthorities().stream().collect(Collectors.toList());
    //                 }
    //                 @Override public Object getCredentials() { return null; }
    //                 @Override public Object getDetails() { return null; }
    //                 @Override public Object getPrincipal() { return userDetails; }
    //                 @Override public boolean isAuthenticated() { return true; }
    //                 @Override public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {}
    //                 @Override public String getName() { return userDetails.getUsername(); }
    //             }
    //     );

    //     List<String> roles = userDetails.getAuthorities().stream()
    //             .map(GrantedAuthority::getAuthority)
    //             .collect(Collectors.toList());

    //     JwtResponseDTO jwtResponse = new JwtResponseDTO(
    //             token,
    //             user.getUserId(),
    //             user.getUsername(),
    //             user.getEmail(),
    //             roles
    //     );

    //     return ResponseEntity.ok(jwtResponse);
        
    // }

    @GetMapping("/oauth2/failure")
    public ResponseEntity<?> oauth2Failure() {
        return ResponseEntity.badRequest().body(new MessageResponseDTO("Google login failed"));
    }

    /*
     * Handles user registration requests.
     * Endpoint: POST /api/auth/signup
     *
     @param signUpRequestDTO The registration details (username, email, password).
     @return ResponseEntity containing a success message or error details.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequestDTO signUpRequestDTO) {
        // The @Valid annotation triggers validation based on annotations
        // within the SignupRequest DTO (e.g., @NotBlank, @Size, @Email).
        // If validation fails, a MethodArgumentNotValidException is thrown,
        // which should be handled by a global exception handler (@ControllerAdvice)
        // to return a user-friendly error response (e.g., 400 Bad Request).

        // Delegate the registration logic to the AuthService
        authService.registerUser(signUpRequestDTO);
        return ResponseEntity.ok(new MessageResponseDTO("User registered successfully!"));
    }

    /*
     * Handles user authentication (login) requests.
     * Endpoint: POST /api/auth/signin
     *
     * @param loginRequestDTO The login credentials (username, password).
     * @return ResponseEntity containing the JWT token and user details or an error.
     */
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        // The @Valid annotation triggers validation for LoginRequest fields.
        // Similar to signup, handle validation exceptions globally.

        // Delegate authentication to AuthService, which uses AuthenticationManager.
        JwtResponseDTO jwtResponse = authService.authenticateUser(loginRequestDTO);
        return ResponseEntity.ok(jwtResponse);
    }
}
