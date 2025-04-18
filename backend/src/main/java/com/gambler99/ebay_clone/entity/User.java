package com.gambler99.ebay_clone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "users" ,
        //tl;dr: indexes are used to speed up the WHERE and JOIN clauses,
        //and these columns are likely to be frequently used search criteria
        indexes = {
            @Index(name = "idx_email" , columnList = "email"),
            @Index(name = "idx_google_id" , columnList = "google_id"),
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "username", nullable = false, length = 50, unique = true)
    private String username;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;

    @Column(name = "google_id", length = 100, unique = true)
    private String googleId;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist //auto set the createdAt and updatedAt when a new user is created
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate  //auto set the updatedAt when a user is modified
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @ToString.Exclude
    @Builder.Default
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

}
