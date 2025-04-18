package com.gambler99.ebay_clone.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    // Custom exception to handle cases where an email already exists in the system.
    // This exception can be thrown when a user tries to register with an email that is already taken.
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
