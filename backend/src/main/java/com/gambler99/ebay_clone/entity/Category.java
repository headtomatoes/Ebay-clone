package com.gambler99.ebay_clone.entity;

import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table (name = "categories",indexes = {
        @Index(name = "idx_name", columnList = "name"),
        @Index(name = "parent_category_id", columnList = "parent_category_id")
}
)
@Getter
@Setter
@Builder
@NoArgsConstructor // this is needed for JPA to create an instance of the class
@AllArgsConstructor // this is needed for @Builder to work
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // = Auto increment
    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(name = "name", nullable = false, length = 100, unique = true)
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // RELATIONSHIP: Many categories belong to 1 parent category
    // like vegan food and meat both belong to the food categories (a little farfetch)
    @ManyToOne(fetch = FetchType.LAZY)//.lazy generally enough for
    //@ManyToOne relationship
    //@OneToMany relationship
    @JoinColumn(name = "parent_category_id", referencedColumnName = "category_id", foreignKey = @ForeignKey(name = "FK_PARENT_CATEGORY"))
    private Category parentCategory;

    // RELATIONSHIP: Many products belong to 1 category
    // like ...
    @OneToMany(
        mappedBy = "category", // => point to the one that owns the relation or the ONE in One to Many
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    @ToString.Exclude
    @Builder.Default
    private Set<Product> products = new HashSet<>();


    // placeholder for adding method hashCode and equal

}
