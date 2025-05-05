package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.AuctionResponseDTO;
import com.gambler99.ebay_clone.dto.BidResponseDTO;
import com.gambler99.ebay_clone.dto.CreateAuctionRequestDTO;
import com.gambler99.ebay_clone.dto.PlaceBidRequestDTO;
import com.gambler99.ebay_clone.security.UserDetailsImpl;
import com.gambler99.ebay_clone.service.AuctionService;
import com.gambler99.ebay_clone.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api/public/auctions") // Base URL for auction-related endpoints
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;
    private final BidService bidService;

    @PostMapping
    @PreAuthorize("hasRole('SELLER')") // Only users with the 'SELLER' role can create auctions
    public ResponseEntity<AuctionResponseDTO> createAuction(
            @Valid @RequestBody CreateAuctionRequestDTO createDTO,
            @AuthenticationPrincipal UserDetailsImpl sellerDetails) throws BadRequestException // Inject the authenticated user
    {
        // check if the sellerDetails is null
        if (sellerDetails == null) {
            // Should not happen if PreAuthorize works, but good practice
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Delegate the auction creation logic to the AuctionService
        AuctionResponseDTO createAuction = auctionService.createAuction(createDTO, sellerDetails);

        // Build location URI for the newly created auction
        // The URI is constructed using the current request's URI and the auction ID
        // This URI can be used to retrieve the created auction later
        // URI: /api/auctions/{id}
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{auctionId}")
                .buildAndExpand(createAuction.id()) // Use the auction ID from the created auction
                .toUri();

        // Return the created auction and its location in the response
        return ResponseEntity.created(location).body(createAuction);
    }

    @GetMapping
    public ResponseEntity<Page<AuctionResponseDTO>> getAllAuctions(Pageable pageable) {

        Page<AuctionResponseDTO> auctionPages = auctionService.getAllAuctions(pageable);
        return ResponseEntity.ok(auctionPages);
    }

    @GetMapping("/{auctionId}")
    public ResponseEntity<AuctionResponseDTO> getAuctionById(@PathVariable Long auctionId) {
        AuctionResponseDTO auction = auctionService.getAuctionById(auctionId);
        return ResponseEntity.ok(auction); // Return 200 OK
    }

    @PostMapping("/{auctionId}/bids")
    @PreAuthorize("isAuthenticated()") // Only users who are authenticated can place bids, but everyone can see the auction
    public ResponseEntity<BidResponseDTO> placeBid(
            @PathVariable Long auctionId,
            @Valid @RequestBody PlaceBidRequestDTO placeBidDTO,
            @AuthenticationPrincipal UserDetailsImpl bidderDetails // Inject the authenticated user
            ) {
        BidResponseDTO createdBid = bidService.placeBid(auctionId, placeBidDTO, bidderDetails);
        // Return 201 Created with the new bid details
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBid);
    }

    @GetMapping("/{auctionId}/bids")
    public ResponseEntity<Page<BidResponseDTO>>  getBidsByAuctionId(
            @PathVariable Long auctionId,
            Pageable pageable
    ) {
        Page<BidResponseDTO> bidPages = auctionService.getBidsForAuction(auctionId, pageable);
        return ResponseEntity.ok(bidPages);
    }
}
