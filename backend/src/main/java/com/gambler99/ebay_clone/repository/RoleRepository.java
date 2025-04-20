package com.gambler99.ebay_clone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.gambler99.ebay_clone.entity.Role;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Finds a Role entity by its 'roleName' property. Returns Optional to handle cases where no role is found.
    Optional<Role> findByRoleName(String roleName);
}
