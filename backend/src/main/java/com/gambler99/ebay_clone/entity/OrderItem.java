package com.gambler99.ebay_clone.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items", indexes = {
        @Index(name = "idx_order_id", columnList = "order_id"),
        @Index(name = "idx_product_id", columnList = "product_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, foreignKey = @ForeignKey(name = "FK_ORDER"))
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false, foreignKey = @ForeignKey(name = "FK_PRODUCT"))
    private Product product;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "price_at_purchase", nullable = false, precision = 12, scale = 2)
    private BigDecimal priceAtPurchase;

    public BigDecimal calculateTotalPrice() {
        return priceAtPurchase;
    }
}

// package com.gambler99.ebay_clone.entity;

// import java.math.BigDecimal;

// import jakarta.persistence.*;
// import lombok.*;

// @Entity
// @Table(name = "order_items", indexes = {
//         @Index(name = "idx_order_id", columnList = "order_id"),
//         @Index(name = "idx_product_id", columnList = "product_id")
// })
// @Getter
// @Setter
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// public class OrderItem {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long orderItemId;

//     @ManyToOne(fetch = FetchType.LAZY, optional = false)
//     @JoinColumn(name = "order_id", nullable = false, foreignKey = @ForeignKey(name = "FK_ORDER"))
//     private Order order;

//     @ManyToOne(fetch = FetchType.LAZY, optional = false)
//     @JoinColumn(name = "product_id", nullable = false, foreignKey = @ForeignKey(name = "FK_PRODUCT"))
//     private Product product;

//     @Column(nullable = false)
//     private int quantity;

//     @Column(name = "price_at_purchase", nullable = false, precision = 12, scale = 2)
//     private BigDecimal priceAtPurchase; // Price of the product at the time of purchase

//     public BigDecimal calculateTotalPrice() {
//         return priceAtPurchase.multiply(BigDecimal.valueOf(quantity));
//     }
// }