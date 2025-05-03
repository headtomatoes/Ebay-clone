package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.entity.Auction;
import com.gambler99.ebay_clone.entity.Bid;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.repository.AuctionRepository;
import com.gambler99.ebay_clone.repository.BidRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;



import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AuctionClosingServiceTest {

    @Mock private AuctionRepository auctionRepository;
    @Mock private BidRepository bidRepository;

    @InjectMocks private AuctionClosingService closingService;

    @Test
    void closeEndedAuctions_setsWinnerIfBidsExist() {
        User bidder = new User(); bidder.setUserId(3L); bidder.setUsername("winner");

        Auction auction = new Auction();
        auction.setAuctionId(1L);
        auction.setStatus(Auction.AuctionStatus.ACTIVE);
        auction.setEndTime(LocalDateTime.now().minusMinutes(1));

        Bid bid = new Bid();
        bid.setBidAmount(BigDecimal.valueOf(100));
        bid.setBidder(bidder);

        when(auctionRepository.findByStatusAndEndTimeBefore(eq(Auction.AuctionStatus.ACTIVE), any()))
                .thenReturn(List.of(auction));
        when(bidRepository.findTopByAuctionOrderByBidAmountDesc(auction)).thenReturn(Optional.of(bid));

        closingService.closeEndedAuctions();

        assertEquals(bidder, auction.getWinner());
        assertEquals(Auction.AuctionStatus.ENDED_MET_RESERVE, auction.getStatus());
        verify(auctionRepository).save(auction);
    }

    @Test
    void closeEndedAuctions_setsNoBidsStatusIfNoBids() {
        Auction auction = new Auction();
        auction.setAuctionId(1L);
        auction.setStatus(Auction.AuctionStatus.ACTIVE);
        auction.setEndTime(LocalDateTime.now().minusMinutes(1));

        when(auctionRepository.findByStatusAndEndTimeBefore(any(), any()))
                .thenReturn(List.of(auction));
        when(bidRepository.findTopByAuctionOrderByBidAmountDesc(auction)).thenReturn(Optional.empty());

        closingService.closeEndedAuctions();

        assertEquals(Auction.AuctionStatus.ENDED_NO_BIDS, auction.getStatus());
        verify(auctionRepository).save(auction);
    }
}
