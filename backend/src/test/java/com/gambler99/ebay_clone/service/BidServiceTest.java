package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.BidResponseDTO;
import com.gambler99.ebay_clone.dto.PlaceBidRequestDTO;
import com.gambler99.ebay_clone.entity.*;
import com.gambler99.ebay_clone.exception.ResourceNotFoundException;
import com.gambler99.ebay_clone.repository.AuctionRepository;
import com.gambler99.ebay_clone.repository.BidRepository;
import com.gambler99.ebay_clone.repository.UserRepository;
import com.gambler99.ebay_clone.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;



import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class BidServiceTest {

    @Mock private AuctionRepository auctionRepository;
    @Mock private BidRepository bidRepository;
    @Mock private UserRepository userRepository;
    @Mock private SimpMessagingTemplate messagingTemplate;

    @InjectMocks private BidService bidService;

    private User bidder;
    private User seller;
    private Auction auction;
    private UserDetailsImpl bidderDetails;

    @BeforeEach
    void setup() {
        bidder = new User(); bidder.setUserId(1L);
        seller = new User(); seller.setUserId(2L);

        Product product = new Product(); product.setSeller(seller);

        auction = new Auction();
        auction.setAuctionId(100L);
        auction.setProduct(product);
        auction.setStatus(Auction.AuctionStatus.ACTIVE);
        auction.setCurrentPrice(BigDecimal.valueOf(50));
        auction.setStartTime(LocalDateTime.now().minusMinutes(5));
        auction.setEndTime(LocalDateTime.now().plusMinutes(5));

        bidderDetails = new UserDetailsImpl(
                1L,
                "bidder",
                "bidder@example.com",
                "hashedPass123",
                List.of()
        );
    }

    @Test
    void placeBid_successful() {
        PlaceBidRequestDTO dto = new PlaceBidRequestDTO(BigDecimal.valueOf(60));

        when(userRepository.findById(1L)).thenReturn(Optional.of(bidder));
        when(auctionRepository.findById(100L)).thenReturn(Optional.of(auction));
        when(bidRepository.save(any())).thenAnswer(i -> {
            Bid b = i.getArgument(0);
            b.setBidId(200L);
            return b;
        });

        BidResponseDTO response = bidService.placeBid(100L, dto, bidderDetails);

        assertEquals(BigDecimal.valueOf(60), response.bidAmount());
        assertEquals("bidder", response.bidderUsername());
    }

    @Test
    void placeBid_failsIfBidTooLow() {
        PlaceBidRequestDTO dto = new PlaceBidRequestDTO(BigDecimal.valueOf(10));
        when(userRepository.findById(1L)).thenReturn(Optional.of(bidder));
        when(auctionRepository.findById(100L)).thenReturn(Optional.of(auction));

        assertThrows(IllegalArgumentException.class,
                () -> bidService.placeBid(100L, dto, bidderDetails));
    }

    @Test
    void placeBid_failsIfOwnerBids() {
        bidder.setUserId(2L); // now same as seller
        when(userRepository.findById(2L)).thenReturn(Optional.of(bidder));
        when(auctionRepository.findById(100L)).thenReturn(Optional.of(auction));

        PlaceBidRequestDTO dto = new PlaceBidRequestDTO(BigDecimal.valueOf(60));

        assertThrows(IllegalArgumentException.class,
                () -> bidService.placeBid(100L, dto, new UserDetailsImpl( 2L,
                        "owner",
                        "owner@example.com",
                        "hashedOwnerPass",
                        List.of())));
    }
}
