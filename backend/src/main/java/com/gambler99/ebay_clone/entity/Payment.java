package com.gambler99.ebay_clone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "payments", indexes = {
        @Index(name = "idx_order_id", columnList = "order_id"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_transaction_id", columnList = "transaction_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor // this is needed for JPA to create an instance of the class
@AllArgsConstructor // this is needed for @Builder to work
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id", nullable = false)
    private Long paymentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_gateway", nullable = false, columnDefinition = "ENUM('STRIPE', 'PAYPAL', 'COD', 'BANK_TRANSFER', 'OTHER')")
    @Builder.Default
    private PaymentGateway paymentGateway = PaymentGateway.COD;

    public enum PaymentGateway{
        STRIPE,
        PAYPAL,
        COD,
        BANK_TRANSFER,
        OTHER
    }

    @Column(name = "transaction_id", nullable = false)
    private String transactionId;

    @Column(name = "amount", nullable = false , precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') = 'PENDING'")
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    public enum PaymentStatus{
        PENDING,
        SUCCESS,
        FAILED,
        REFUNDED
    }

    @Column(name = "payment_date", nullable = false)
    LocalDateTime paymentDate;

    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Relationship with Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "order_id", foreignKey = @ForeignKey(name = "FK_ORDER"))
    @ToString.Exclude
    private Order order;

}
