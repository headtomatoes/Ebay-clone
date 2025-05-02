package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.entity.Auction;
import com.gambler99.ebay_clone.entity.Bid;
import com.gambler99.ebay_clone.repository.AuctionRepository;
import com.gambler99.ebay_clone.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuctionClosingService {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;

    @Scheduled(fixedRate = 60000) // Check every 60 seconds see if any auctions need to be closed
    @Transactional
    public void closeEndedAuctions() {
        LocalDateTime now = LocalDateTime.now();
        // Find auctions ready to be closed
        List<Auction> auctionsToClose = auctionRepository.findByStatusAndEndTimeBefore(Auction.AuctionStatus.ACTIVE, now);

        for (Auction auction : auctionsToClose) {
            // Find the highest bid for this auction
            Optional<Bid> winningBidOpt = bidRepository.findTopByAuctionOrderByBidAmountDesc(auction);

            if (winningBidOpt.isPresent()) {
                // Bids were placed
                auction.setWinner(winningBidOpt.get().getBidder());
                if (auction.getReservePrice().compareTo(winningBidOpt.get().getBidAmount()) < 0) {
                    // Winning bid is above the reserve price
                    auction.setStatus(Auction.AuctionStatus.ENDED_MET_RESERVE);
                } else {
                    // Winning bid is below the reserve price
                    auction.setStatus(Auction.AuctionStatus.ENDED_NO_RESERVE);
                }
            } else {
                // No bids placed
                auction.setStatus(Auction.AuctionStatus.ENDED_NO_BIDS);
            }
            auctionRepository.save(auction); // Save changes within the loop/transaction
            // ADD LATER: Trigger notification/event later

        }
    }
}
