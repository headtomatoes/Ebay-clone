package com.gambler99.ebay_clone.entity;

import jakarta.persistence.*;
import lombok.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;



@Entity
@Table (name = "products")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", referencedColumnName = "user_id", foreignKey = @ForeignKey(name = "FK_SELLER"))
    private User seller; // Assuming a User entity exists

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "category_id", foreignKey = @ForeignKey(name = "FK_CATEGORY"))
    private categories category; // Assuming a Category entity exists


    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false, columnDefinition = "INT UNSIGNED DEFAULT 0")
    private Integer stockQuantity;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    public enum ProductStatus {

    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "ENUM('ACTIVE', 'INACTIVE', 'SOLD_OUT', 'DRAFT') DEFAULT 'DRAFT'")
    private ProductStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;




}