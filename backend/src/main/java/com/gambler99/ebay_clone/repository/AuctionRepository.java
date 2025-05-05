package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.Auction;
import com.gambler99.ebay_clone.entity.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
    // expected conflict:
    //Two users placing winning bids simultaneously
    //An auction being closed while a bid is being processed
    //Incorrect final price calculations due to concurrent updates
    // use optimistic locking for rare conflicts
    // use pessimistic locking for expected conflicts

    // find auctions by the product id (nullable) = to check if product is in auction state
    /**
 * Retrieves the auction associated with the specified product ID, if present.
 *
 * @param productId the unique identifier of the product
 * @return an {@code Optional} containing the auction if found, or empty if no auction exists for the given product
 */
    <Optional> Auction findByProduct_ProductId(Long productId);

    // check for closing service
    //SELECT * FROM auction
    /**
     * Retrieves all auctions with the specified status that have ended before the given time, applying a pessimistic write lock to prevent concurrent modifications.
     *
     * @param auctionStatus the status of the auctions to find
     * @param endTime the exclusive upper bound for the auction end time
     * @return a list of matching auctions locked for writing
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE) // Use when conflicts are expected and critical
    List<Auction> findByStatusAndEndTimeBefore(Auction.AuctionStatus auctionStatus, LocalDateTime endTime);


    /**
     * Retrieves a list of auctions with the specified status that end after the given time, applying a pessimistic write lock to prevent concurrent modifications.
     *
     * @param auctionStatus the status of the auctions to retrieve
     * @param endTime the time after which the auctions must end
     * @return a list of matching auctions
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<Auction> findByStatusAndEndTimeAfter(Auction.AuctionStatus auctionStatus, LocalDateTime endTime);

    /**
     * Retrieves all auctions with the specified status that started before the given time, applying a pessimistic write lock to prevent concurrent modifications.
     *
     * @param auctionStatus the status of the auctions to find
     * @param startTime the upper bound for the auction start time (exclusive)
     * @return a list of matching auctions locked for writing
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<Auction> findByStatusAndStartTimeBefore(Auction.AuctionStatus auctionStatus, LocalDateTime startTime);


    // find auctions by the AuctionId
    //SELECT * FROM auction WHERE auction_id = ?
    /**
 * Retrieves an auction by its unique auction ID.
 *
 * @param auctionId the unique identifier of the auction
 * @return the Auction entity with the specified ID, or null if not found
 */
    Auction findByAuctionId(Long auctionId);

    /**
 * Checks if an auction exists for the specified product and status.
 *
 * @param product the product to check for an associated auction
 * @param status the auction status to match
 * @return true if an auction exists for the given product and status, false otherwise
 */
boolean existsByProductAndStatus(Product product, Auction.AuctionStatus status);
}
