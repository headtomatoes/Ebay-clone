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

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600) // Allow requests from all origins (adjust for production)
@RestController //methods return domain objects instead of views
@RequestMapping("/api/auth") // Base URL for authentication endpoints
public class AuthController {
    private final AuthService authService;

    @Autowired //Constructor Injection
    public AuthController(AuthService authService) {
        this.authService = authService;
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
