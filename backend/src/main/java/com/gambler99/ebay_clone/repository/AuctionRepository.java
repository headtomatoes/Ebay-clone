package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.Auction;
import com.gambler99.ebay_clone.entity.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


public interface AuctionRepository extends JpaRepository<Auction, Long> {
    // expected conflict:
    //Two users placing winning bids simultaneously
    //An auction being closed while a bid is being processed
    //Incorrect final price calculations due to concurrent updates
    // use optimistic locking for rare conflicts
    // use pessimistic locking for expected conflicts

    // find auctions by the product id (nullable) = to check if product is in auction state
    //SELECT * FROM auction WHERE product_id = ?
    <Optional> Auction findByProduct_ProductId(Long productId);

    // check for closing service
    //SELECT * FROM auction
    //WHERE status = ? AND end_time < ?
    @Lock(LockModeType.PESSIMISTIC_WRITE) // Use when conflicts are expected and critical
    List<Auction> findByStatusAndEndTimeBefore(Auction.AuctionStatus auctionStatus, LocalDateTime endTime);


    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<Auction> findByStatusAndEndTimeAfter(Auction.AuctionStatus auctionStatus, LocalDateTime endTime);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<Auction> findByStatusAndStartTimeBefore(Auction.AuctionStatus auctionStatus, LocalDateTime startTime);


    // find auctions by the AuctionId
    //SELECT * FROM auction WHERE auction_id = ?
    //@Lock(LockModeType.OPTIMISTIC) // Use when conflicts are rare but possible
    Auction findByAuctionId(Long auctionId);

    boolean existsByProductAndStatus(Product product, Auction.AuctionStatus status);
}
