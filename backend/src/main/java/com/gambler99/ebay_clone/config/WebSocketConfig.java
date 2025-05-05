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

    /**
     * Configures the message broker for WebSocket messaging with STOMP support.
     *
     * Enables a simple in-memory broker on the "/topic" destination with client and server heartbeats every 10 seconds,
     * managed by a custom task scheduler. Sets "/app" as the prefix for messages sent from clients to server-side handlers.
     *
     * @param config the message broker registry to configure
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple broker with heartbeat
        config.enableSimpleBroker("/topic")
              .setHeartbeatValue(new long[] {10000, 10000}) // Client and server heartbeat every 10 seconds
              .setTaskScheduler(heartbeatScheduler()); // Task scheduler for heartbeats

        config.setApplicationDestinationPrefixes("/app"); // Prefix for client messages TO server (if needed)
    }

    /**
     * Creates and initializes a thread pool task scheduler for managing WebSocket heartbeat tasks.
     *
     * @return a TaskScheduler with a pool size of 2 and a custom thread name prefix for heartbeat management
     */
    @Bean
    public TaskScheduler heartbeatScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("websocket-heartbeat-thread-");
        scheduler.initialize();
        return scheduler;
    }

    /**
     * Registers STOMP endpoints for WebSocket connections at the "/ws" path.
     *
     * <p>
     * Adds two endpoints: one with SockJS fallback enabled to support clients without native WebSocket support,
     * and another as a direct WebSocket endpoint. Both endpoints allow cross-origin requests from any origin,
     * which is suitable for development environments.
     * </p>
     *
     * @param registry the registry to which the STOMP endpoints are added
     */
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

    /**
     * Creates and configures a WebSocket container factory bean with custom buffer sizes and timeouts.
     *
     * @return a ServletServerContainerFactoryBean with increased message buffer sizes, session idle timeout, and asynchronous send timeout
     */
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
