package com.gambler99.ebay_clone.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_customer_id", columnList = "customer_id"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_order_date", columnList = "order_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false, updatable = false)
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "user_id", nullable = false, foreignKey = @ForeignKey(name = "FK_USER"))
    private User customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> orderItems = new HashSet<>();

    @Column(name = "order_date", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "ENUM('PENDING_PAYMENT', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') DEFAULT 'PENDING_PAYMENT'")
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;

    @Column(name = "total_amount", precision = 12, scale = 2, nullable = false, columnDefinition = "DECIMAL(12, 2) DEFAULT 0")
    private BigDecimal totalAmount;

    public void calculateTotalAmount() {
        this.totalAmount = orderItems.stream()
                .map(OrderItem::calculateTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public enum OrderStatus {
        PENDING_PAYMENT,
        PROCESSING,
        SHIPPED,
        DELIVERED,
        CANCELLED,
        RETURNED
    }
}

// package com.gambler99.ebay_clone.entity;

// import jakarta.persistence.*;
// import lombok.*;
// import java.math.BigDecimal;
// import java.time.LocalDateTime;
// import java.util.HashSet;
// import java.util.Set;

// @Entity
// @Table(name = "orders", indexes = {
//         @Index(name = "idx_customer_id", columnList = "customer_id"),
//         @Index(name = "idx_status", columnList = "status"),
//         @Index(name = "idx_order_date", columnList = "order_date")
// })
// @Getter
// @Setter
// @ToString
// @NoArgsConstructor
// @AllArgsConstructor
// public class Order {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "order_id", nullable = false, updatable = false)
//     private Long orderId;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "customer_id", referencedColumnName = "user_id", nullable = false, foreignKey = @ForeignKey(name = "FK_USER"))
//     @ToString.Exclude
//     private User customer;

//     @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
//     private Set<OrderItem> orderItems = new HashSet<>();

//     @Column(name = "order_date", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
//     private LocalDateTime orderDate;

//     @Enumerated(EnumType.STRING)
//     @Column(name = "status", nullable = false, columnDefinition = "ENUM('PENDING_PAYMENT', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') DEFAULT 'PENDING_PAYMENT'")
//     private OrderStatus status = OrderStatus.PENDING_PAYMENT;

//     @Column(name = "total_amount", precision = 12, scale = 2, nullable = false, columnDefinition = "DECIMAL(12, 2) DEFAULT 0")
//     private BigDecimal totalAmount;

//     @Column(name = "shipping_address_snapshot", columnDefinition = "TEXT")
//     private String shippingAddressSnapshot;

//     @Column(name = "billing_address_snapshot", columnDefinition = "TEXT")
//     private String billingAddressSnapshot;

//     @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
//     private LocalDateTime createdAt;

//     @Column(name = "updated_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
//     private LocalDateTime updatedAt;

//     @PrePersist
//     protected void onCreate() {
//         createdAt = LocalDateTime.now();
//         updatedAt = LocalDateTime.now();
//     }

//     @PreUpdate
//     protected void onUpdate() {
//         updatedAt = LocalDateTime.now();
//     }

//     // Enum for order status
//     public enum OrderStatus {
//         PENDING_PAYMENT,
//         PROCESSING,
//         SHIPPED,
//         DELIVERED,
//         CANCELLED,
//         RETURNED
//     }

//     public void calculateTotalAmount() {
//         this.totalAmount = orderItems.stream()
//                 .map(OrderItem::calculateTotalPrice)
//                 .reduce(BigDecimal.ZERO, BigDecimal::add);
//     }
    
// }

// package com.gambler99.ebay_clone.entity;

// import jakarta.persistence.*;
// import lombok.*;
// import java.math.BigDecimal;
// import java.time.LocalDateTime;
// import java.util.HashSet;
// import java.util.Set;

// @Entity
// @Table(name = "orders", indexes = {
//         @Index(name = "idx_customer_id", columnList = "customer_id"),
//         @Index(name = "idx_status", columnList = "status"),
//         @Index(name = "idx_order_date", columnList = "order_date")
// })
// @Getter
// @Setter
// @ToString
// @NoArgsConstructor
// @AllArgsConstructor
// public class Order {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "order_id", nullable = false, updatable = false)
//     private Long orderId;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "customer_id", referencedColumnName = "user_id", nullable = false, foreignKey = @ForeignKey(name = "FK_USER"))
//     @ToString.Exclude
//     private User customer;
//     @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
//     private Set<OrderItem> orderItems = new HashSet<>();
//     @ManyToMany(fetch = FetchType.LAZY)
//     @JoinTable(  
//             name = "order_items",
//             joinColumns = @JoinColumn(name = "order_id"),
//             inverseJoinColumns = @JoinColumn(name = "product_id")
//     )
//     private Set<Product> products = new HashSet<>();

//     @Column(name = "order_date", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
//     private LocalDateTime orderDate;

//     @Enumerated(EnumType.STRING)
//     @Column(name = "status", nullable = false, columnDefinition = "ENUM('PENDING_PAYMENT', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') DEFAULT 'PENDING_PAYMENT'")
//     private OrderStatus status = OrderStatus.PENDING_PAYMENT;

//     @Column(name = "total_amount", precision = 12, scale = 2, nullable = false, columnDefinition = "DECIMAL(12, 2) DEFAULT 0")
//     private BigDecimal totalAmount;

//     @Column(name = "shipping_address_snapshot", columnDefinition = "TEXT")
//     private String shippingAddressSnapshot;

//     @Column(name = "billing_address_snapshot", columnDefinition = "TEXT")
//     private String billingAddressSnapshot;

//     @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
//     private LocalDateTime createdAt;

//     @Column(name = "updated_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
//     private LocalDateTime updatedAt;

//     @PrePersist
//     protected void onCreate() {
//         createdAt = LocalDateTime.now();
//         updatedAt = LocalDateTime.now();
//     }

//     @PreUpdate
//     protected void onUpdate() {
//         updatedAt = LocalDateTime.now();
//     }

//     // Enum for order status
//     public enum OrderStatus {
//         PENDING_PAYMENT,
//         PROCESSING,
//         SHIPPED,
//         DELIVERED,
//         CANCELLED,
//         RETURNED
//     }
// }