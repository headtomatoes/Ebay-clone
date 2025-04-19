package com.gambler99.ebay_clone.exception;

public class RoleNotFoundException extends RuntimeException {
    // Custom exception to handle cases where a role is not found in the system.
    // This exception can be thrown when a user tries to assign a role that does not exist.
    public RoleNotFoundException(String message) {
        super(message);
    }
}
