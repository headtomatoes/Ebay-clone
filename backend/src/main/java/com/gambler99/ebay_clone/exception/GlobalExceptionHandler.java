package com.gambler99.ebay_clone.exception;

import com.gambler99.ebay_clone.dto.MessageResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // This class is used to handle global exceptions in the application.
    // It can be extended to include specific exception handling methods as needed.
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // --- Custom Business Logic Exceptions ---

    @ExceptionHandler(value = {UsernameAlreadyExistsException.class, EmailAlreadyExistsException.class})
    @ResponseStatus(HttpStatus.CONFLICT) // 409 Conflict is suitable for existing resources
    public ResponseEntity<MessageResponseDTO> handleUserExistsException(RuntimeException ex, WebRequest request) {
        log.warn("Conflict error: {}", ex.getMessage());
        MessageResponseDTO message = new MessageResponseDTO(ex.getMessage());
        return new ResponseEntity<>(message, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(RoleNotFoundException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400 Bad Request as it likely stems from bad input or config error
    public ResponseEntity<MessageResponseDTO> handleRoleNotFoundException(RoleNotFoundException ex, WebRequest request) {
        log.error("Role not found error: {}", ex.getMessage());
        MessageResponseDTO message = new MessageResponseDTO(ex.getMessage());
        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }

    // --- Spring Security Exceptions ---

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED) // 401 Unauthorized
    public ResponseEntity<MessageResponseDTO> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        log.warn("Authentication failed: {}", ex.getMessage());
        MessageResponseDTO message = new MessageResponseDTO("Error: Invalid username or password"); // Generic message
        return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
    }

    // Add handlers for AccessDeniedException (403 Forbidden) if needed

    // --- Validation Exceptions ---

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400 Bad Request
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        log.warn("Validation errors: {}", errors);
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        // Alternatively, return a MessageResponseDTO with a generic message or concatenated errors
        // return new ResponseEntity<>(new MessageResponseDTO("Validation failed: " + errors.toString()), HttpStatus.BAD_REQUEST);
    }

    // --- Generic Fallback Exception Handler ---

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // 500 Internal Server Error
    public ResponseEntity<MessageResponseDTO> handleAllUncaughtException(Exception ex, WebRequest request) {
        log.error("An unexpected error occurred: {}", ex.getMessage(), ex); // Log stack trace for unexpected errors
        MessageResponseDTO message = new MessageResponseDTO("An unexpected internal server error occurred.");
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
