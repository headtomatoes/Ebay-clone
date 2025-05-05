package com.gambler99.ebay_clone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "bids",
        indexes = {
                @Index(name = "idx_auction_bid_amount", columnList = "auction_bid_amount"),
                @Index(name = "idx_auction_id", columnList = "auction_id"),
                @Index(name = "idx_bid_time", columnList = "bid_time"),
                @Index(name = "idx_bidder_id", columnList = "bidder_id")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bid_id", nullable = false)
    private Long bidId;

    @Column(name = "bid_time", nullable = false)
    private LocalDateTime bidTime;

    @Column(name = "bid_amount", nullable = false)
    private BigDecimal bidAmount;

    @Column(name = "is_winning_bid", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isWinningBid;

    // RELATIONSHIP
    // Many bids belong to 1 auction
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    // Many bids belong to 1 bidder
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidder_id", nullable = false)
    private User bidder;

    @Override
    public String toString() {
        if (this instanceof HibernateProxy) {
            return ((HibernateProxy) this).getHibernateLazyInitializer().getImplementation().toString();
        }
        return "Bid{" +
                "bidId=" + bidId +
                ", bidTime=" + bidTime +
                ", bidAmount=" + bidAmount +
                ", isWinningBid=" + isWinningBid +
                ", auction=" + auction +
                ", bidder=" + bidder +
                '}';
    }

    // hashCode and equals methods can be added here if needed
}
