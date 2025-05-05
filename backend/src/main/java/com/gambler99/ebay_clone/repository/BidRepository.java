package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.Auction;
import com.gambler99.ebay_clone.entity.Bid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    // find the highest bid for a specific auction
    Optional<Bid> findTopByAuction_AuctionIdOrderByBidAmountDesc(Long auctionId);

    // find the highest bid for a specific auction by a specific bidder
    Optional<Bid> findTopByAuction_AuctionIdAndBidder_UserIdOrderByBidAmountDesc(Long auctionId, Long userId);

    // find the highest bid (using Auction object)
    Optional<Bid> findTopByAuctionOrderByBidAmountDesc(Auction auction);

    // find all bids for an auction in chronological order (newest first)
    Page<Bid> findByAuctionOrderByBidTimeDesc(Auction auction, Pageable pageable); //(To get bids for display).

    // count the number of bids for a specific auction
    long countByAuction(Auction auction);
}
