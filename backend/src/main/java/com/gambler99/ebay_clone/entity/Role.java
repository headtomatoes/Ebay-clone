package com.gambler99.ebay_clone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table (name = "roles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id", nullable = false)
    private Long roleId;

    @Column(name = "role_name", nullable = false, length = 50, unique = true)
    private String roleName;

    @ManyToMany (mappedBy = "roles")
    @ToString.Exclude
    @Builder.Default
    private Set<User> users = new HashSet<>(); // Initialize with an empty set to avoid NullPointerException

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        // Use getClass() comparison for JPA proxies
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        // Compare using the unique business key (roleName)
        // Ensure roleName is non-null and correctly represents identity
        return Objects.equals(roleName, role.roleName);
    }

    @Override
    public int hashCode() {
        // Generate hash ONLY from the unique business key (roleName)
        return Objects.hash(roleName);
        // Alternatively, if using ID and handling transient state carefully:
        // return Objects.hash(roleId); // Or return getClass().hashCode(); if roleId is null
    }

    // Optional: Implement toString manually if needed, excluding collections
    @Override
    public String toString() {
        return "Role{" +
                "roleId=" + roleId +
                ", roleName='" + roleName + '\'' +
                '}';
    }
}
