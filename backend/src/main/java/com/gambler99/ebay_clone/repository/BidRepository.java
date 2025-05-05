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
    /**
 * Retrieves the highest bid for the auction with the specified ID.
 *
 * @param auctionId the unique identifier of the auction
 * @return an {@code Optional} containing the highest {@code Bid} if present, or empty if no bids exist for the auction
 */
    Optional<Bid> findTopByAuction_AuctionIdOrderByBidAmountDesc(Long auctionId);

    /**
 * Retrieves the highest bid placed by a specific bidder in a given auction.
 *
 * @param auctionId the ID of the auction
 * @param userId the ID of the bidder
 * @return an {@code Optional} containing the highest {@code Bid} by the specified bidder in the auction, or empty if none found
 */
    Optional<Bid> findTopByAuction_AuctionIdAndBidder_UserIdOrderByBidAmountDesc(Long auctionId, Long userId);

    /**
 * Retrieves the highest bid for the specified auction.
 *
 * @param auction the auction for which to find the highest bid
 * @return an Optional containing the highest Bid if present, or empty if no bids exist for the auction
 */
    Optional<Bid> findTopByAuctionOrderByBidAmountDesc(Auction auction);

    /**
 * Retrieves a paginated list of bids for the specified auction, ordered by bid time in descending order.
 *
 * @param auction the auction for which to retrieve bids
 * @param pageable pagination and sorting information
 * @return a page of bids for the auction, with the newest bids first
 */
    Page<Bid> findByAuctionOrderByBidTimeDesc(Auction auction, Pageable pageable); //(To get bids for display).

    /**
 * Returns the total number of bids placed on the specified auction.
 *
 * @param auction the auction for which to count bids
 * @return the number of bids associated with the given auction
 */
    long countByAuction(Auction auction);
}
