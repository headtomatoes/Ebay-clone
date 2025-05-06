/**
 * Exception thrown when a user attempts to interact with a product
 * that is no longer available **/
package com.gambler99.ebay_clone.exception;

public class ProductUnavailableException extends RuntimeException {
    public ProductUnavailableException(String message) {
        super(message);
    }
}