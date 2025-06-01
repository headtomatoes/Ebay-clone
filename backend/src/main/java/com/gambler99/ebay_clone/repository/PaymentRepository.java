package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // find payment by order id
    List<Payment> findByOrder_OrderId(Long orderId);

    // find payment by transaction id maybe null
    Optional<Payment> findByTransactionId(String transactionId);

    // find payment by order, payment gateway, and status
    Optional<Payment> findByOrderAndPaymentGatewayAndStatus(
            com.gambler99.ebay_clone.entity.Order order,
            Payment.PaymentGateway paymentGateway,
            Payment.PaymentStatus status);

    // additional methods can be added here as needed
}
