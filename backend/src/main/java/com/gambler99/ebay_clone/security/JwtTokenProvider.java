package com.gambler99.ebay_clone.security;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.stream.Collectors;

@Component // to make this class a Spring bean => enable dependency injection
public class JwtTokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    // inject JWT secret and expiration time from application properties
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration.ms}")
    private int jwtExpirationMs;

    // Generate JWT token (Authentication object (passport) is passed in)
    public String generateJwtToken(Authentication authentication) {
        //Pulls out the user’s details by casting getPrincipal() to UserDetailsImpl
        // (a custom profile with username, ID, ... and roles)
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        // Extract roles from authorities
        String roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        // Create JWT token with username and roles
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("id", userDetails.getUserId())
                .claim("roles", roles)  // Include user roles as a claim
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)//deprecated as of Java 17
                .compact();
    }

    // Get username from JWT token
    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser()    //deprecated
                .setSigningKey(jwtSecret)   //deprecated
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Validate JWT token
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);   //deprecated
            return true;
        } catch (SignatureException e) {    //deprecated
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}