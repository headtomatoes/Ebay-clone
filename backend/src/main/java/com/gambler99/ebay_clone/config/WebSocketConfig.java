package com.gambler99.ebay_clone.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple broker with heartbeat
        config.enableSimpleBroker("/topic")
              .setHeartbeatValue(new long[] {10000, 10000}) // Client and server heartbeat every 10 seconds
              .setTaskScheduler(heartbeatScheduler()); // Task scheduler for heartbeats

        config.setApplicationDestinationPrefixes("/app"); // Prefix for client messages TO server (if needed)
    }

    @Bean
    public TaskScheduler heartbeatScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("websocket-heartbeat-thread-");
        scheduler.initialize();
        return scheduler;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register endpoint with SockJS support
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // Allow all origins for development
                .withSockJS(); // Enable SockJS fallback options

        // Add a direct WebSocket endpoint without SockJS
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");  // Allow all origins for development
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(32768); // Increased buffer size
        container.setMaxBinaryMessageBufferSize(32768); // Increased buffer size
        container.setMaxSessionIdleTimeout(120000L); // 120 seconds idle timeout
        container.setAsyncSendTimeout(60000L); // 60 seconds async send timeout
        return container;
    }

}
