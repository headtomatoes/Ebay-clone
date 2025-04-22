package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Finds a User entity by its 'username' property. Returns Optional to handle cases where no user is found.
    Optional<User> findByUsername(String username);

    // Finds a User entity by its 'email' property. Returns Optional.
    Optional<User> findByEmail(String email);

    // Checks if a User entity exists with the given 'username'. Returns true or false.
    Boolean existsByUsername(String username);

    // Checks if a User entity exists with the given 'email'. Returns true or false.
    Boolean existsByEmail(String email);

    // Finds a User entity by its 'googleId' property. Returns Optional.
    Optional<User> findByGoogleId(String googleId);


    // can add if needed
    Optional<User> findByUserId(Long userId);
}
