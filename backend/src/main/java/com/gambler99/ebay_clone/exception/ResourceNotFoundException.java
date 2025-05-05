package com.gambler99.ebay_clone.exception;

public class ResourceNotFoundException extends RuntimeException {
    // Custom exception to handle cases where a requested resource (like a user or product) is not found.
    // This exception can be thrown when a user tries to access a resource that does not exist in the system.
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
    }
}
