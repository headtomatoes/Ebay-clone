// package com.gambler99.ebay_clone.service;

// import com.gambler99.ebay_clone.dto.CreateAuctionRequestDTO;
// import com.gambler99.ebay_clone.entity.*;
// import com.gambler99.ebay_clone.repository.*;
// import com.gambler99.ebay_clone.security.UserDetailsImpl;
// import org.apache.coyote.BadRequestException;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.Mockito.*;

// class AuctionServiceTest {

//     @Mock
//     private AuctionRepository auctionRepository;

//     @Mock
//     private ProductRepository productRepository;

//     @Mock
//     private BidRepository bidRepository;

//     @Mock
//     private UserRepository userRepository;

//     @InjectMocks
//     private AuctionService auctionService;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     void createAuction_success() throws Exception {
//         Long sellerId = 1L;
//         Long productId = 10L;
//         User seller = new User(); seller.setUserId(sellerId);
//         Product product = new Product(); product.setProductId(productId); product.setSeller(seller); product.setPrice(BigDecimal.valueOf(100));

//         CreateAuctionRequestDTO request = new CreateAuctionRequestDTO(
//                 productId,
//                 LocalDateTime.now().minusMinutes(1),
//                 LocalDateTime.now().plusDays(1),
//                 BigDecimal.valueOf(50)
//         );

//         UserDetailsImpl userDetails = new UserDetailsImpl(
//                 sellerId,
//                 "sellerUser",
//                 "seller@example.com",
//                 "password",
//                 List.of(new SimpleGrantedAuthority("ROLE_USER"))
//         );

//         when(userRepository.findById(sellerId)).thenReturn(Optional.of(seller));
//         when(productRepository.findById(productId)).thenReturn(Optional.of(product));
//         when(auctionRepository.existsByProductAndStatus(product, Auction.AuctionStatus.SCHEDULED)).thenReturn(false);
//         when(auctionRepository.existsByProductAndStatus(product, Auction.AuctionStatus.ACTIVE)).thenReturn(false);
//         when(auctionRepository.save(any(Auction.class))).thenAnswer(i -> i.getArgument(0));

//         var result = auctionService.createAuction(request, userDetails);

//         assertNotNull(result);
//         assertEquals(productId, result.productId());
//         assertEquals(BigDecimal.valueOf(50), result.startPrice());
//     }

//     @Test
//     void createAuction_failsIfNotOwner() {
//         Long sellerId = 1L;
//         Long productId = 10L;
//         User seller = new User(); seller.setUserId(sellerId);
//         User otherSeller = new User(); otherSeller.setUserId(2L);
//         Product product = new Product(); product.setProductId(productId); product.setSeller(otherSeller);

//         CreateAuctionRequestDTO request = new CreateAuctionRequestDTO(
//                 productId,
//                 LocalDateTime.now(),
//                 LocalDateTime.now().plusDays(1),
//                 BigDecimal.valueOf(50)
//         );

//         UserDetailsImpl userDetails = new UserDetailsImpl(
//                 sellerId,
//                 "sellerUser",
//                 "seller@example.com",
//                 "password",
//                 List.of(new SimpleGrantedAuthority("ROLE_USER"))
//         );

//         when(userRepository.findById(sellerId)).thenReturn(Optional.of(seller));
//         when(productRepository.findById(productId)).thenReturn(Optional.of(product));

//         assertThrows(BadRequestException.class, () -> auctionService.createAuction(request, userDetails));
//     }

//     @Test
//     void createAuction_failsIfAlreadyActive() {
//         Long sellerId = 1L;
//         Long productId = 10L;
//         User seller = new User(); seller.setUserId(sellerId);
//         Product product = new Product(); product.setProductId(productId); product.setSeller(seller);

//         CreateAuctionRequestDTO request = new CreateAuctionRequestDTO(
//                 productId,
//                 LocalDateTime.now(),
//                 LocalDateTime.now().plusDays(1),
//                 BigDecimal.valueOf(50)
//         );

//         UserDetailsImpl userDetails = new UserDetailsImpl(
//                 sellerId,
//                 "sellerUser",
//                 "seller@example.com",
//                 "password",
//                 List.of(new SimpleGrantedAuthority("ROLE_USER"))
//         );

//         when(userRepository.findById(sellerId)).thenReturn(Optional.of(seller));
//         when(productRepository.findById(productId)).thenReturn(Optional.of(product));
//         when(auctionRepository.existsByProductAndStatus(product, Auction.AuctionStatus.SCHEDULED)).thenReturn(false);
//         when(auctionRepository.existsByProductAndStatus(product, Auction.AuctionStatus.ACTIVE)).thenReturn(true);

//         assertThrows(BadRequestException.class, () -> auctionService.createAuction(request, userDetails));
//     }

//     @Test
//     void createAuction_failsIfEndBeforeStart() {
//         Long sellerId = 1L;
//         Long productId = 10L;
//         User seller = new User(); seller.setUserId(sellerId);
//         Product product = new Product(); product.setProductId(productId); product.setSeller(seller);

//         CreateAuctionRequestDTO request = new CreateAuctionRequestDTO(
//                 productId,
//                 LocalDateTime.now().plusDays(1),
//                 LocalDateTime.now(),
//                 BigDecimal.valueOf(50)
//         );

//         UserDetailsImpl userDetails = new UserDetailsImpl(
//                 sellerId,
//                 "sellerUser",
//                 "seller@example.com",
//                 "password",
//                 List.of(new SimpleGrantedAuthority("ROLE_USER"))
//         );

//         when(userRepository.findById(sellerId)).thenReturn(Optional.of(seller));
//         when(productRepository.findById(productId)).thenReturn(Optional.of(product));

//         assertThrows(BadRequestException.class, () -> auctionService.createAuction(request, userDetails));
//     }

//     @Test
//     void createAuction_failsIfStartPriceTooHigh() {
//         Long sellerId = 1L;
//         Long productId = 10L;
//         User seller = new User(); seller.setUserId(sellerId);
//         Product product = new Product(); product.setProductId(productId); product.setSeller(seller); product.setPrice(BigDecimal.valueOf(100));

//         CreateAuctionRequestDTO request = new CreateAuctionRequestDTO(
//                 productId,
//                 LocalDateTime.now(),
//                 LocalDateTime.now().plusDays(1),
//                 BigDecimal.valueOf(150)
//         );

//         UserDetailsImpl userDetails = new UserDetailsImpl(
//                 sellerId,
//                 "sellerUser",
//                 "seller@example.com",
//                 "password",
//                 List.of(new SimpleGrantedAuthority("ROLE_USER"))
//         );

//         when(userRepository.findById(sellerId)).thenReturn(Optional.of(seller));
//         when(productRepository.findById(productId)).thenReturn(Optional.of(product));

//         assertThrows(BadRequestException.class, () -> auctionService.createAuction(request, userDetails));
//     }

//     @Test
//     void createAuction_failsIfProductNotFound() {
//         Long sellerId = 1L;
//         Long productId = 10L;
//         User seller = new User(); seller.setUserId(sellerId);

//         CreateAuctionRequestDTO request = new CreateAuctionRequestDTO(
//                 productId,
//                 LocalDateTime.now(),
//                 LocalDateTime.now().plusDays(1),
//                 BigDecimal.valueOf(50)
//         );

//         UserDetailsImpl userDetails = new UserDetailsImpl(
//                 sellerId,
//                 "sellerUser",
//                 "seller@example.com",
//                 "password",
//                 List.of(new SimpleGrantedAuthority("ROLE_USER"))
//         );

//         when(userRepository.findById(sellerId)).thenReturn(Optional.of(seller));
//         when(productRepository.findById(productId)).thenReturn(Optional.empty());

//         assertThrows(RuntimeException.class, () -> auctionService.createAuction(request, userDetails));
//     }

//     @Test
//     void createAuction_failsIfSellerNotFound() {
//         Long sellerId = 1L;
//         Long productId = 10L;

//         CreateAuctionRequestDTO request = new CreateAuctionRequestDTO(
//                 productId,
//                 LocalDateTime.now(),
//                 LocalDateTime.now().plusDays(1),
//                 BigDecimal.valueOf(50)
//         );

//         UserDetailsImpl userDetails = new UserDetailsImpl(
//                 sellerId,
//                 "sellerUser",
//                 "seller@example.com",
//                 "password",
//                 List.of(new SimpleGrantedAuthority("ROLE_USER"))
//         );
//         when(userRepository.findById(sellerId)).thenReturn(Optional.empty());

//         assertThrows(RuntimeException.class, () -> auctionService.createAuction(request, userDetails));
//     }
// }