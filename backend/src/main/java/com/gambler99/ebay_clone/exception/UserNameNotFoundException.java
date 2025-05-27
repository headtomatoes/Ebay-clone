package com.gambler99.ebay_clone.exception;

public class UserNameNotFoundException extends RuntimeException {
    public UserNameNotFoundException(String username) {
        super("No user found with username: " + username);
    }
}
