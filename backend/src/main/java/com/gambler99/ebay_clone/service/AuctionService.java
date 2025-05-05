package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.AuctionResponseDTO;
import com.gambler99.ebay_clone.dto.BidResponseDTO;
import com.gambler99.ebay_clone.dto.CreateAuctionRequestDTO;
import com.gambler99.ebay_clone.entity.Auction;
import com.gambler99.ebay_clone.entity.Bid;
import com.gambler99.ebay_clone.entity.Product;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.repository.AuctionRepository;
import com.gambler99.ebay_clone.repository.BidRepository;
import com.gambler99.ebay_clone.repository.ProductRepository;
import com.gambler99.ebay_clone.repository.UserRepository;
import com.gambler99.ebay_clone.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionService {
    // AuctionService is responsible for managing auction-related operations

    private final AuctionRepository auctionRepository;
    private final ProductRepository productRepository;
    private final BidRepository bidRepository;
    private final UserRepository userRepository;

    /**
     * Creates a new auction for a product owned by the seller, enforcing business rules and validation.
     *
     * Validates product ownership, ensures no overlapping active or scheduled auctions exist for the product,
     * checks that the auction end time is after the start time, and that the starting price does not exceed the product price.
     * Sets the auction status to SCHEDULED if the start time is in the future, otherwise ACTIVE.
     *
     * @param dto the auction creation request containing product ID, start time, end time, and starting price
     * @return the created auction as an AuctionResponseDTO
     * @throws BadRequestException if validation fails or business rules are violated
     */
    @Transactional
    public AuctionResponseDTO createAuction(CreateAuctionRequestDTO dto, UserDetailsImpl sellerDetails) throws BadRequestException {
        // Find the seller by userId || subject to change
        User seller = userRepository.findById(sellerDetails.getUserId())
                .orElseThrow(()
                -> new RuntimeException("Seller not found with ID: " + sellerDetails.getUserId()));

        // find the product by productId
        Product product = productRepository.findById(dto.productId())
                .orElseThrow(()
                -> new RuntimeException("Product not found with ID: " + dto.productId()));

        // check the product is belong to the given seller
        if (!product.getSeller().getUserId().equals(sellerDetails.getUserId())){
            throw new BadRequestException("You are not the owner of this product to create an auction");
        }

        // check if the product is already in an auction
        boolean isScheduledAuction = auctionRepository.existsByProductAndStatus(
                product,
                Auction.AuctionStatus.SCHEDULED);
        boolean isActiveAuction = auctionRepository.existsByProductAndStatus(
                product,
                Auction.AuctionStatus.ACTIVE);

        if (isScheduledAuction || isActiveAuction) {
            throw new BadRequestException("Product is already associated with an active or scheduled auction.");
        }

        // check end time is after start time
        if (dto.startTime().isAfter(dto.endTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        // check if the start price is valid, smaller than or equal the product price
        if (dto.startPrice().compareTo(product.getPrice()) > 0) {
            throw new BadRequestException("Starting price cannot be greater than the product price");
        }

        // create the auction
        Auction auction = Auction.builder()
                .product(product)
                .startTime(dto.startTime())
                .endTime(dto.endTime())
                .startingPrice(dto.startPrice())
                .currentPrice(dto.startPrice())
                .build();

        // Set status to PENDING or ACTIVE based on startTime
        LocalDateTime now = LocalDateTime.now();
        if (dto.startTime().isAfter(now)) {
            auction.setStatus(Auction.AuctionStatus.SCHEDULED);
        } else {
            auction.setStatus(Auction.AuctionStatus.ACTIVE);
        }

        // Save auction
        Auction savedAuction = auctionRepository.save(auction);

        // Map to AuctionResponseDTO and return
        return mapToAuctionResponseDTO(savedAuction);
    }

    /**
     * Retrieves an auction by its ID and returns its details as an AuctionResponseDTO.
     *
     * @param auctionId the unique identifier of the auction to retrieve
     * @return the auction details mapped to an AuctionResponseDTO
     * @throws RuntimeException if no auction is found with the given ID
     */
    @Transactional(readOnly = true)
    public AuctionResponseDTO getAuctionById(Long auctionId) {
        // Find the auction by ID
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found with ID: " + auctionId));

        // Map to AuctionResponseDTO and return
        return mapToAuctionResponseDTO(auction);
    }

    /**
     * Retrieves a paginated list of all auctions.
     *
     * @param pageable pagination and sorting information
     * @return a page of AuctionResponseDTO objects representing the auctions
     */
    @Transactional(readOnly = true)
    public Page<AuctionResponseDTO> getAllAuctions(Pageable pageable) {
        // Fetch all auctions with pagination
        Page<Auction> auctionPages = auctionRepository.findAll(pageable);

        // Map each Auction entity to AuctionResponseDTO
        return auctionPages.map(this::mapToAuctionResponseDTO);

    }

    /**
     * Retrieves a paginated list of bids for a specific auction, ordered by bid time descending.
     *
     * @param auctionId the ID of the auction to retrieve bids for
     * @param pageable pagination information
     * @return a page of bid response DTOs for the specified auction
     * @throws RuntimeException if the auction with the given ID does not exist
     */
    @Transactional(readOnly = true)
    public Page<BidResponseDTO> getBidsForAuction(Long auctionId , Pageable pageable) {
        // Find the auction by ID
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found with ID: " + auctionId));

        // Fetch bids for the auction with pagination
        Page<Bid> bidPage = bidRepository.findByAuctionOrderByBidTimeDesc(auction, pageable);

        // Map each Page<Bid> entity to Page<BidResponseDTO>
        return bidPage.map(this::mapToBidResponseDTO);
    }

    /**
     * Updates the status of scheduled auctions to active if their start time has been reached.
     *
     * This method is executed automatically every minute to ensure auctions transition from SCHEDULED to ACTIVE status at the correct time.
     */

    @Transactional
    @Scheduled(fixedRate = 60000) // Run every minute
    public void updateAuctionStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // Activate scheduled auctions whose start time has been reached
        List<Auction> scheduledAuctions = auctionRepository.findByStatusAndStartTimeBefore(
                Auction.AuctionStatus.SCHEDULED, now);

        for (Auction auction : scheduledAuctions) {
            auction.setStatus(Auction.AuctionStatus.ACTIVE);
            auctionRepository.save(auction);
            // Future enhancement: Trigger notifications or events when an auction becomes active
        }
    }


    /**
     * Validates that the specified auction is currently active and open for bidding.
     *
     * @param auctionId the ID of the auction to validate
     * @return the auction entity if it is active and within the bidding period
     * @throws BadRequestException if the auction is not active or not within the allowed bidding time
     */

    @Transactional(readOnly = true)
    public Auction validateAuctionForBidding(Long auctionId) throws BadRequestException {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found with ID: " + auctionId));

        if (auction.getStatus() != Auction.AuctionStatus.ACTIVE) {
            throw new BadRequestException("Bids can only be placed on active auctions");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(auction.getStartTime()) || now.isAfter(auction.getEndTime())) {
            throw new BadRequestException("Auction is not currently active");
        }

        return auction;
    }


    /**
     * Converts an Auction entity to an AuctionResponseDTO, including highest bid amount, total bids, and winner information.
     *
     * @param auction the Auction entity to convert
     * @return an AuctionResponseDTO containing auction details, highest bid, total bids, and winner username if available
     */
    public AuctionResponseDTO mapToAuctionResponseDTO(Auction auction) {
        // Fetch highest bid amount
        BigDecimal highestBidAmount = bidRepository.findTopByAuctionOrderByBidAmountDesc(auction)
                .map(Bid::getBidAmount)
                .orElse(null); // Or auction.getCurrentPrice() if no bids yet?

        // Fetch count
        long totalBids = bidRepository.countByAuction(auction);

        return new AuctionResponseDTO(
                auction.getAuctionId(),
                auction.getStartTime(),
                auction.getEndTime(),
                auction.getStartingPrice(),
                auction.getCurrentPrice(),
                auction.getStatus(),
                auction.getProduct().getProductId(),
                auction.getWinner() != null ? auction.getWinner().getUsername() : null,
                highestBidAmount,
                (int) totalBids // Cast count to int for DTO if necessary
        );
    }

    /**
     * Converts a Bid entity to a BidResponseDTO containing bid details and the bidder's username.
     *
     * @param bid the Bid entity to convert
     * @return a BidResponseDTO with bid ID, amount, time, and bidder username
     */
    private BidResponseDTO mapToBidResponseDTO(Bid bid) {
        return new BidResponseDTO(
                bid.getBidId(),
                bid.getBidAmount(),
                bid.getBidTime(),
                bid.getBidder().getUsername()
        );
    }
}
