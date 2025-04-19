package com.gambler99.ebay_clone.security;

import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private UserRepository userRepository;

    @Autowired // Constructor-based dependency injection
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional  // Ensures LAZY loading works properly
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Fetch user by username including their roles
        // @Transactional annotation ensures LAZY loaded collections are properly loaded
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Build and return UserDetailsImpl based on the user entity
        return UserDetailsImpl.build(user);
    }
}
