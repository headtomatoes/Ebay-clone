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
        // 1. Same object reference (identity check)
        if (this == o) return true;

        // 2. Null check
        if (o == null) return false;

        // 3. Determine the effective class of the input object
        Class<?> oEffectiveClass = o instanceof HibernateProxy
                ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass()
                : o.getClass();

        // 4. Determine the effective class of the current object
        Class<?> thisEffectiveClass = this instanceof HibernateProxy
                ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass()
                : this.getClass();

        // 5. Compare effective classes
        if (thisEffectiveClass != oEffectiveClass) return false;

        // 6. Cast to Role and compare business key
        Role role = (Role) o;
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
