package com.gambler99.ebay_clone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "auctions",
        indexes = {
                @Index(name = "idx_end_time", columnList = "end_time"),
                @Index(name = "idx_product_id", columnList = "product_id"),
                @Index(name = "idx_status", columnList = "status"),
                @Index(name = "idx_winner_id", columnList = "winner_id")
            }
        )
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Auction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auction_id", nullable = false)
    private Long auctionId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "starting_price", nullable = false)
    private BigDecimal startingPrice;

    @Column(name = "current_price", nullable = false)
    private BigDecimal currentPrice;

    @Column(name = "reserve_price", nullable = false)
    private BigDecimal reservePrice;

    @Column(name = "bid_increment", nullable = false)
    private BigDecimal bidIncrement;

    // optimistic locking
//    @Version
//    private Long version;

    @Column(name = "status", nullable = false, columnDefinition = "ENUM('SCHEDULED','ACTIVE','ENDED_MET_RESERVE','ENDED_NO_RESERVE', 'ENDED_NO_BIDS' , 'CANCELLED')= 'SCHEDULED'")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuctionStatus status = AuctionStatus.SCHEDULED;

    public enum AuctionStatus {
        SCHEDULED,
        ACTIVE,
        ENDED_MET_RESERVE,
        ENDED_NO_RESERVE,
        ENDED_NO_BIDS,
        CANCELLED
    }

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // RELATIONSHIP
    // many auctions belong to 1 product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // many auctions can be won by 1 user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id", nullable = true)
    private User winner;

    // 1 auction can have many bids
    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("bidTime DESC")
    private List<Bid> bids = new ArrayList<>();

    @Override
    public String toString() {
        if (this instanceof HibernateProxy) {
            return ((HibernateProxy) this).getHibernateLazyInitializer().getImplementation().toString();
        }
        return "Auction{" +
                "auctionId=" + auctionId +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", startingPrice=" + startingPrice +
                ", currentPrice=" + currentPrice +
                ", reservePrice=" + reservePrice +
                ", bidIncrement=" + bidIncrement +
                ", status=" + status +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", product=" + product +
                ", winner=" + winner +
                '}';
    }

    // hashCode and equals methods can be added here if needed
}
