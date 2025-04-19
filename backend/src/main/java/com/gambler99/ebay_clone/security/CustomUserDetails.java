package com.gambler99.ebay_clone.security;

import com.gambler99.ebay_clone.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

/**
 * Custom implementation of Spring Security's UserDetails interface.
 * Wraps the application's User entity to provide authentication information.
 */

@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles()
                .stream()
                .map(SimpleGrantedAuthority::new) // ← this line fixed
                .collect(Collectors.toSet());
    }

    @Override public String getPassword() { return user.getPassword(); }  // Returns the user's password//
    @Override public String getUsername() { return user.getUsername(); }// Returns the user's username//

    @Override public boolean isAccountNonExpired() { return true; } // Indicates whether the user's account has expired//
    @Override public boolean isAccountNonLocked() { return true; } // Indicates whether the user is locked or unlocked//
    @Override public boolean isCredentialsNonExpired() { return true; }// Indicates whether the user's credentials (password) have expired//
    @Override public boolean isEnabled() { return true; } // Indicates whether the user is enabled (true = enabled)//

    public User getUser() { return user; }
}
