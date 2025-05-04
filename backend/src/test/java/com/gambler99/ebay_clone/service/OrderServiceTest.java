package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.entity.Order;
import com.gambler99.ebay_clone.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class OrderServiceTest {

    private final OrderRepository orderRepository = Mockito.mock(OrderRepository.class);
    private final OrderService orderService = new OrderServiceImpl(orderRepository);

    @Test
    public void testUpdateOrderStatus() {
        Order order = new Order();
        order.setOrderId(1L);
        order.setStatus(Order.OrderStatus.PENDING_PAYMENT);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        Order updatedOrder = orderService.updateOrderStatus(1L, Order.OrderStatus.SHIPPED);

        assertEquals(Order.OrderStatus.SHIPPED, updatedOrder.getStatus());
    }
}