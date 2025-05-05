package com.gambler99.ebay_clone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EbayCloneApplication {
  
	public static void main(String[] args) {
		// to read .env file
		EnvLoader.load();
		
		SpringApplication.run(EbayCloneApplication.class, args);
	}

}
