package com.gambler99.ebay_clone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

//import org.springframework.beans.factory.annotation.Value;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendAuctionWinEmail(String to, String auctionTitle, String auctionUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Congratulations! You won the auction: " + auctionTitle);
        message.setText(
            "Dear customer,\n\n" +
            "You have won the auction for: " + auctionTitle + ".\n\n" +
            "View your auction here: " + auctionUrl + "\n\n" +
            "Thank you for participating!\n\nBest regards,\nE-Auction Team"
        );
        mailSender.send(message);
    }
}