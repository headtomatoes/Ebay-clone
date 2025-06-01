```powershell
backend/
├── .gitattributes
├── .gitignore
├── Dockerfile
├── ebay_clone.iml
├── mvnw
├── mvnw.cmd
├── note.md
├── note.txt
├── pom.xml
├── .mvn/
│   └── wrapper/
│       └── maven-wrapper.properties
├── document/
│   └── PaymentAPI.md
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── gambler99/
│   │   │           └── ebay_clone/
│   │   │               ├── EbayCloneApplication.java
│   │   │               ├── EnvLoader.java
│   │   │               ├── ServletInitializer.java
│   │   │               ├── config/
│   │   │               │   ├── SecurityConfig.java
│   │   │               │   └── WebSocketConfig.java
│   │   │               ├── controller/
│   │   │               │   ├── AuctionController.java
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── CartController.java
│   │   │               │   ├── CategoryController.java
│   │   │               │   ├── OrderController.java
│   │   │               │   ├── PaymentController.java
│   │   │               │   ├── ProductController.java
│   │   │               │   ├── ReviewController.java
│   │   │               │   └── SearchController.java
│   │   │               ├── dto/
│   │   │               │   ├── AuctionResponseDTO.java
│   │   │               │   ├── BidResponseDTO.java
│   │   │               │   ├── CartItemDetailsDTO.java
│   │   │               │   ├── CartItemDTO.java
│   │   │               │   ├── CartRequestDTO.java
│   │   │               │   ├── CategoryDTO.java
│   │   │               │   ├── CreateAuctionRequestDTO.java
│   │   │               │   ├── JwtResponseDTO.java
│   │   │               │   ├── LoginRequestDTO.java
│   │   │               │   ├── MessageResponseDTO.java
│   │   │               │   ├── OrderItemDTO.java
│   │   │               │   ├── OrderItemRequestDTO.java
│   │   │               │   ├── OrderRequestDTO.java
│   │   │               │   ├── OrderResponseDTO.java
│   │   │               │   ├── PaymentRequestDTO.java
│   │   │               │   ├── PaymentResponseDTO.java
│   │   │               │   ├── PlaceBidRequestDTO.java
│   │   │               │   ├── ProductCreateDTO.java
│   │   │               │   ├── ProductDetailDTO.java
│   │   │               │   ├── ProductSummaryDTO.java
│   │   │               │   ├── ReviewDTO.java
│   │   │               │   ├── ReviewRequestDTO.java
│   │   │               │   ├── SignupRequestDTO.java
│   │   │               │   └── StripePaymentIntentDetailsDTO.java
│   │   │               ├── entity/
│   │   │               │   ├── Auction.java
│   │   │               │   ├── Bid.java
│   │   │               │   ├── CartItem.java
│   │   │               │   ├── Category.java
│   │   │               │   ├── Order.java
│   │   │               │   ├── OrderItem.java
│   │   │               │   ├── Payment.java
│   │   │               │   ├── Product.java
│   │   │               │   ├── Review.java
│   │   │               │   ├── Role.java
│   │   │               │   └── User.java
│   │   │               ├── exception/
│   │   │               │   ├── EmailAlreadyExistsException.java
│   │   │               │   ├── GlobalExceptionHandler.java
│   │   │               │   ├── InsufficientStockException.java
│   │   │               │   ├── NoCartItemsException.java
│   │   │               │   ├── OrderException.java
│   │   │               │   ├── PaymentProcessingException.java
│   │   │               │   ├── ProductUnavailableException.java
│   │   │               │   ├── ResourceNotFoundException.java
│   │   │               │   ├── RoleNotFoundException.java
│   │   │               │   └── UsernameAlreadyExistsException.java
│   │   │               ├── repository/
│   │   │               │   ├── AuctionRepository.java
│   │   │               │   ├── BidRepository.java
│   │   │               │   ├── CartItemRepository.java
│   │   │               │   ├── CategoryRepository.java
│   │   │               │   ├── OrderItemRepository.java
│   │   │               │   ├── OrderRepository.java
│   │   │               │   ├── PaymentRepository.java
│   │   │               │   ├── ProductRepository.java
│   │   │               │   ├── ReviewRepository.java
│   │   │               │   ├── RoleRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               ├── security/
│   │   │               │   ├── AuthEntryPointJwt.java
│   │   │               │   ├── AuthTokenFilter.java
│   │   │               │   ├── JwtTokenProvider.java
│   │   │               │   ├── UserDetailsImpl.java
│   │   │               │   └── UserDetailsServiceImpl.java
│   │   │               └── service/
│   │   │                   ├── AuctionClosingService.java
│   │   │                   ├── AuctionService.java
│   │   │                   ├── AuthService.java
│   │   │                   ├── BidService.java
│   │   │                   ├── CartService.java
│   │   │                   ├── CategoryService.java
│   │   │                   ├── EmailService.java
│   │   │                   ├── OrderService.java
│   │   │                   ├── OrderServiceImpl.java
│   │   │                   ├── PaymentService.java
│   │   │                   ├── ProductService.java
│   │   │                   ├── ReviewService.java
│   │   │                   ├── StripeService.java
│   │   │                   └── UserService.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/
│   │           ├── changelog/
│   │           │   ├── db.changelog-master.xml
│   │           │   ├── constraints/
│   │           │   │   └── 014-create-foreign-keys.xml
│   │           │   ├── indexes/
│   │           │   │   └── 015-create-indexes.xml
│   │           │   ├── tables/
│   │           │   │   ├── 001-create-users-table.xml
│   │           │   │   ├── 002-create-roles-table.xml
│   │           │   │   ├── 003-create-user_roles-table.xml
│   │           │   │   ├── 004-create-categories-table.xml
│   │           │   │   ├── 005-create-products-table.xml
│   │           │   │   ├── 006-create-cart_items-table.xml
│   │           │   │   ├── 007-create-orders-table.xml
│   │           │   │   ├── 008-create-order_items-table.xml
│   │           │   │   ├── 009-create-payments-table.xml
│   │           │   │   ├── 010-create-shipping-table.xml
│   │           │   │   ├── 011-create-reviews-table.xml
│   │           │   │   ├── 012-create-auctions-table.xml
│   │           │   │   └── 013-create-bids-table.xml
│   │           │   └── updates/
│   │           │       ├── 016-create-role-updates.xml
│   │           │       └── 017-seed-test-data.xml
│   │           └── data/
│   │               ├── sample-categories.csv
│   │               ├── sample-products.csv
│   │               ├── sample-roles.csv
│   │               ├── sample-user-roles.csv
│   │               └── sample-users.csv
│   └── test/
│       └── java/
│           └── com/
│               └── gambler99/
│                   └── ebay_clone/
│                       ├── EbayCloneApplicationTests.java
│                       └── service/
│                           ├── AuctionClosingServiceTest.java
│                           ├── AuctionServiceTest.java
│                           ├── BidServiceTest.java
│                           ├── CategoryServiceTest.java
│                           └── OrderServiceTest.java
└── target/
    └── classes/
        ├── application.properties
        ├── com/
        │   └── gambler99/
        │       └── ebay_clone/
        │           ├── EbayCloneApplication.class
        │           ├── EnvLoader.class
        │           ├── ServletInitializer.class
        │           ├── config/
        │           │   ├── SecurityConfig.class
        │           │   └── WebSocketConfig.class
        │           ├── controller/
        │           │   ├── AuctionController.class
        │           │   ├── AuthController.class
        │           │   ├── CartController.class
        │           │   ├── CategoryController.class
        │           │   ├── OrderController.class
        │           │   ├── PaymentController.class
        │           │   ├── ProductController.class
        │           │   ├── ReviewController.class
        │           │   └── SearchController.class
        │           ├── dto/
        │           │   ├── AuctionResponseDTO.class
        │           │   ├── BidResponseDTO.class
        │           │   ├── CartItemDetailsDTO.class
        │           │   ├── CartItemDTO.class
        │           │   ├── CartRequestDTO.class
        │           │   ├── CategoryDTO.class
        │           │   ├── CreateAuctionRequestDTO.class
        │           │   ├── JwtResponseDTO.class
        │           │   ├── LoginRequestDTO.class
        │           │   ├── MessageResponseDTO.class
        │           │   ├── OrderItemDTO$OrderItemDTOBuilder.class
        │           │   ├── OrderItemDTO.class
        │           │   ├── OrderItemRequestDTO.class
        │           │   ├── OrderRequestDTO.class
        │           │   ├── OrderResponseDTO$OrderResponseDTOBuilder.class
        │           │   ├── OrderResponseDTO.class
        │           │   ├── PaymentRequestDTO.class
        │           │   ├── PaymentResponseDTO.class
        │           │   ├── PlaceBidRequestDTO.class
        │           │   ├── ProductCreateDTO.class
        │           │   ├── ProductDetailDTO.class
        │           │   ├── ProductSummaryDTO.class
        │           │   ├── ReviewDTO.class
        │           │   ├── ReviewRequestDTO.class
        │           │   ├── SignupRequestDTO.class
        │           │   └── StripePaymentIntentDetailsDTO.class
        │           ├── entity/
        │           │   ├── Auction$AuctionBuilder.class
        │           │   ├── Auction$AuctionStatus.class
        │           │   ├── Auction.class
        │           │   ├── Bid$BidBuilder.class
        │           │   ├── Bid.class
        │           │   ├── CartItem$CartItemBuilder.class
        │           │   ├── CartItem.class
        │           │   ├── Category$CategoryBuilder.class
        │           │   ├── Category.class
        │           │   ├── Order$OrderStatus.class
        │           │   ├── Order.class
        │           │   ├── OrderItem$OrderItemBuilder.class
        │           │   ├── OrderItem.class
        │           │   ├── Payment$PaymentBuilder.class
        │           │   ├── Payment$PaymentGateway.class
        │           │   ├── Payment$PaymentStatus.class
        │           │   ├── Payment.class
        │           │   ├── Product$ProductBuilder.class
        │           │   ├── Product$ProductStatus.class
        │           │   ├── Product.class
        │           │   ├── Review$ReviewBuilder.class
        │           │   ├── Review.class
        │           │   ├── Role$RoleBuilder.class
        │           │   ├── Role.class
        │           │   ├── User$UserBuilder.class
        │           │   └── User.class
        │           ├── exception/
        │           │   ├── EmailAlreadyExistsException.class
        │           │   ├── GlobalExceptionHandler.class
        │           │   ├── InsufficientStockException.class
        │           │   ├── NoCartItemsException.class
        │           │   ├── OrderException.class
        │           │   ├── PaymentProcessingException.class
        │           │   ├── ProductUnavailableException.class
        │           │   ├── ResourceNotFoundException.class
        │           │   ├── RoleNotFoundException.class
        │           │   └── UsernameAlreadyExistsException.class
        │           ├── repository/
        │           │   ├── AuctionRepository.class
        │           │   ├── BidRepository.class
        │           │   ├── CartItemRepository.class
        │           │   ├── CategoryRepository.class
        │           │   ├── OrderItemRepository.class
        │           │   ├── OrderRepository.class
        │           │   ├── PaymentRepository.class
        │           │   ├── ProductRepository.class
        │           │   ├── ReviewRepository.class
        │           │   ├── RoleRepository.class
        │           │   └── UserRepository.class
        │           ├── security/
        │           │   ├── AuthEntryPointJwt.class
        │           │   ├── AuthTokenFilter.class
        │           │   ├── JwtTokenProvider.class
        │           │   ├── UserDetailsImpl.class
        │           │   └── UserDetailsServiceImpl.class
        │           └── service/
        │               ├── AuctionClosingService.class
        │               ├── AuctionService.class
        │               ├── AuthService.class
        │               ├── BidService.class
        │               ├── CartService.class
        │               ├── CategoryService.class
        │               ├── EmailService.class
        │               ├── OrderService.class
        │               ├── OrderServiceImpl.class
        │               ├── PaymentService.class
        │               ├── ProductService.class
        │               ├── ReviewService.class
        │               ├── StripeService.class
        │               └── UserService.class
        └── db/
            ├── changelog/
            │   ├── db.changelog-master.xml
            │   ├── constraints/
            │   │   └── 014-create-foreign-keys.xml
            │   ├── indexes/
            │   │   └── 015-create-indexes.xml
            │   ├── tables/
            │   │   ├── 001-create-users-table.xml
            │   │   ├── 002-create-roles-table.xml
            │   │   ├── 003-create-user_roles-table.xml
            │   │   ├── 004-create-categories-table.xml
            │   │   ├── 005-create-products-table.xml
            │   │   ├── 006-create-cart_items-table.xml
            │   │   ├── 007-create-orders-table.xml
            │   │   ├── 008-create-order_items-table.xml
            │   │   ├── 009-create-payments-table.xml
            │   │   ├── 010-create-shipping-table.xml
            │   │   ├── 011-create-reviews-table.xml
            │   │   ├── 012-create-auctions-table.xml
            │   │   └── 013-create-bids-table.xml
            │   └── updates/
            │       ├── 016-create-role-updates.xml
            │       └── 017-seed-test-data.xml
            └── data/
                ├── sample-categories.csv
                ├── sample-products.csv
                ├── sample-roles.csv
                ├── sample-user-roles.csv
                └── sample-users.csv
```