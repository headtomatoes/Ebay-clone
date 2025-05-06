package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.BidResponseDTO;
import com.gambler99.ebay_clone.dto.PlaceBidRequestDTO;
import com.gambler99.ebay_clone.entity.Auction;
import com.gambler99.ebay_clone.entity.Bid;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.exception.ResourceNotFoundException;
import com.gambler99.ebay_clone.repository.AuctionRepository;
import com.gambler99.ebay_clone.repository.BidRepository;
import com.gambler99.ebay_clone.repository.UserRepository;
import com.gambler99.ebay_clone.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class BidService {

    private static final Logger log = LoggerFactory.getLogger(BidService.class);

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate; // inject WebSocket template

    // place a bid
    @Transactional
    public BidResponseDTO placeBid(long auctionId, PlaceBidRequestDTO dto, UserDetailsImpl bidderDetails) {

        log.info("Attempting to place bid for auction ID: {} by user ID: {}", auctionId, bidderDetails.getUserId());

        // Validation check:
        // 0. check if the auction status is active yet


        // 1. Get Bidder
        User bidder = userRepository.findById(bidderDetails.getUserId())
                .orElseThrow(() -> {
                    log.error("Bidder not found with ID: {}", bidderDetails.getUserId());
                    return new ResourceNotFoundException("Bidder not found with ID: " + bidderDetails.getUserId());
                });

        // 2. Get Auction
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> {
                    log.error("Auction not found with ID: {}", auctionId);
                    return new ResourceNotFoundException("Auction not found with ID: " + auctionId);
                });

        // Validation check:
        // 3. check if bidder is the owner of the auction
        if (Objects.equals(auction.getProduct().getSeller().getUserId(), bidderDetails.getUserId())) {
            throw new IllegalArgumentException("You cannot bid on your own auction");
        }

        // 4. check if the auction is active
        if (auction.getStatus() != Auction.AuctionStatus.ACTIVE) {
            log.warn("Attempted bid on non-active auction ID {}. Status: {}", auctionId, auction.getStatus());
            throw new IllegalArgumentException("Auction is not active for bidding. Current status: " + auction.getStatus());
        }

        // 5. check if the auction time is valid
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(auction.getEndTime()) || now.isBefore(auction.getStartTime())) {
            log.warn("Attempted bid outside of active time window for auction ID {}. Start: {}, End: {}, Now: {}",
                    auctionId, auction.getStartTime(), auction.getEndTime(), now);
            // Consider AuctionTimingException
            throw new IllegalArgumentException("Bidding is only allowed between auction start and end times.");
        }

        // 6. check if the bid amount is valid
        if (auction.getCurrentPrice() == null) {
            log.error("Auction ID {} has a null currentPrice.", auctionId);
            throw new IllegalStateException("Auction current price is not set.");
        }
        if (dto.bidAmount().compareTo(auction.getCurrentPrice()) <= 0) {
            log.warn("Bid amount {} is not higher than current price {} for auction ID {}",
                    dto.bidAmount(), auction.getCurrentPrice(), auctionId);
            // Consider InvalidBidAmountException
            throw new IllegalArgumentException("Bid amount must be higher than the current price of " + auction.getCurrentPrice());
        }

        // Execute th service:
        // 7. create a new bid with the given bid amount
        Bid bid = Bid.builder()
                .bidder(bidder)
                .auction(auction)
                .bidAmount(dto.bidAmount())
                .bidTime(now)
                .build();

        // 8. update the auction current price to the new bid amount
        auction.setCurrentPrice(dto.bidAmount());

        // 9. save the bid to the database and save the auction with the new bid
        Bid savedBid = bidRepository.save(bid);
        log.info("Saved new bid with ID: {} for auction ID: {}", savedBid.getBidId(), auctionId);
        auctionRepository.save(auction);

        // 10. mapping to DTO
        BidResponseDTO bidResponseDTO = new BidResponseDTO(
                savedBid.getBidId(),
                savedBid.getBidAmount(),
                savedBid.getBidTime(),
                savedBid.getBidder().getUsername() // Assumes username is available
        );

        // 11. Broadcast bid via websocket
        try {
            String destination = "/topic/auctions/" + auctionId + "/bids";
            log.info("Broadcasting bid to WebSocket destination: {}", destination);
            messagingTemplate.convertAndSend(destination, bidResponseDTO);
        } catch (Exception e) {
            // Log WebSocket errors but don't fail the transaction
            log.error("Failed to broadcast bid via WebSocket for auction ID {}: {}", auctionId, e.getMessage(), e);
            // Depending on requirements, you might want to handle this differently (e.g., queueing)
        }

        // map the bid to a response DTO
        return bidResponseDTO;
    }

    // Helpers methods

}
