package com.gambler99.ebay_clone.exception;

public class NoCartItemsException extends RuntimeException{
    public NoCartItemsException(String message) {
        super(message);
    }
}
