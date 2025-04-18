package com.gambler99.ebay_clone.exception;

public class UsernameAlreadyExistsException extends RuntimeException {
    // Custom exception to handle cases where a username already exists in the system.
    // This exception can be thrown when a user tries to register with a username that is already taken.
    public UsernameAlreadyExistsException(String message) {
        super(message);
    }
}
