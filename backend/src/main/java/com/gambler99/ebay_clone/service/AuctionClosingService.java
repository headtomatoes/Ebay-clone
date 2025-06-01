package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.entity.Auction;
import com.gambler99.ebay_clone.entity.Bid;
import com.gambler99.ebay_clone.repository.AuctionRepository;
import com.gambler99.ebay_clone.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
    private final EmailService emailService;
    private final OrderServiceImpl orderService;

    // You can set this property in application.properties: frontend.base-url=http://localhost:5173
    @Value("${frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void closeEndedAuctions() {
        LocalDateTime now = LocalDateTime.now();
        // Find auctions ready to be closed
        List<Auction> auctionsToClose = auctionRepository.
                findByStatusAndEndTimeBefore(Auction.AuctionStatus.ACTIVE, now);

        // Logic to set auction status and notify winners
        for (Auction auction : auctionsToClose) {
            // Find the highest bid for this auction
            Optional<Bid> winningBidOpt = bidRepository.findTopByAuctionOrderByBidAmountDesc(auction);

            if (winningBidOpt.isPresent()) {
                // Bids were placed
                auction.setWinner(winningBidOpt.get().getBidder());
                if (auction.getReservePrice() == null || auction.getReservePrice().compareTo(winningBidOpt.get().getBidAmount()) < 0) {
                    // Winning bid is above the reserve price or no reserve price set
                    auction.setStatus(Auction.AuctionStatus.ENDED_MET_RESERVE);
                } else {
                    // Winning bid is below the reserve price
                    auction.setStatus(Auction.AuctionStatus.ENDED_NO_RESERVE);
                }
                orderService.createOrderFromAuctionItems(winningBidOpt.get().getBidder().getUserId(), auction.getAuctionId(), winningBidOpt.get().getBidAmount());
                auctionRepository.save(auction);

                // Send winner email with auction URL
                String auctionUrl = frontendBaseUrl + "/auctions/" + auction.getAuctionId();
                emailService.sendAuctionWinEmail(
                    winningBidOpt.get().getBidder().getEmail(),
                    auction.getProduct().getName(),
                    auctionUrl
                );
            } else {
                // No bids placed
                auction.setStatus(Auction.AuctionStatus.ENDED_NO_BIDS);
                auctionRepository.save(auction);
            }
        }
    }
}