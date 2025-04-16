package com.gambler99.ebay_clone.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table (name = "roles")
@Data
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
}
