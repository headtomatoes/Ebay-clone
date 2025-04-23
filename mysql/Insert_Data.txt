USE Ebay_clone_db;


-- INSERT DATA FOR USERS:

-- Users (ID starts from 1 due to AUTO_INCREMENT)
INSERT INTO users (username, password_hash, email, address, phone_number)
VALUES 
-- Admin
-- ('admin_user', 'hashed_admin_pass', 'admin@example.com', '100 Admin Lane, Control City', '1000000000'),
('admin_user', '$2a$10$uKt59.nhaWSrLxOKDPBadOVDa7MzO876b4UtPRF3HhZNoVpr0lddS', 'admin@example.com', '100 Admin Lane, Control City', '1000000000'),
-- Sellers
-- ('seller_1', 'hashed_pass', 'seller1@example.com', '1 Seller Way, Sellertown', '1000000001'),
-- ('seller_2', 'hashed_pass', 'seller2@example.com', '2 Seller Way, Sellertown', '1000000002'),
-- ('seller_3', 'hashed_pass', 'seller3@example.com', '3 Seller Way, Sellertown', '1000000003'),
-- ('seller_4', 'hashed_pass', 'seller4@example.com', '4 Seller Way, Sellertown', '1000000004'),
-- -- Buyers
-- ('buyer_1', 'hashed_pass', 'buyer1@example.com', '1 Buyer Rd, Buyerville', '1000000011'),
-- ('buyer_2', 'hashed_pass', 'buyer2@example.com', '2 Buyer Rd, Buyerville', '1000000012'),
-- ('buyer_3', 'hashed_pass', 'buyer3@example.com', '3 Buyer Rd, Buyerville', '1000000013'),
-- ('buyer_4', 'hashed_pass', 'buyer4@example.com', '4 Buyer Rd, Buyerville', '1000000014'),
-- ('buyer_5', 'hashed_pass', 'buyer5@example.com', '5 Buyer Rd, Buyerville', '1000000015'),
-- ('buyer_6', 'hashed_pass', 'buyer6@example.com', '6 Buyer Rd, Buyerville', '1000000016'),
-- ('buyer_7', 'hashed_pass', 'buyer7@example.com', '7 Buyer Rd, Buyerville', '1000000017'),
-- ('buyer_8', 'hashed_pass', 'buyer8@example.com', '8 Buyer Rd, Buyerville', '1000000018'),
-- ('buyer_9', 'hashed_pass', 'buyer9@example.com', '9 Buyer Rd, Buyerville', '1000000019'),
-- ('buyer_10', 'hashed_pass', 'buyer10@example.com', '10 Buyer Rd, Buyerville', '1000000020'),
-- ('buyer_11', 'hashed_pass', 'buyer11@example.com', '11 Buyer Rd, Buyerville', '1000000021'),
-- ('buyer_12', 'hashed_pass', 'buyer12@example.com', '12 Buyer Rd, Buyerville', '1000000022'),
-- ('buyer_13', 'hashed_pass', 'buyer13@example.com', '13 Buyer Rd, Buyerville', '1000000023'),
-- ('buyer_14', 'hashed_pass', 'buyer14@example.com', '14 Buyer Rd, Buyerville', '1000000024'),
-- ('buyer_15', 'hashed_pass', 'buyer15@example.com', '15 Buyer Rd, Buyerville', '1000000025');

-- seller
('seller_1', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'seller1@example.com', '1 Seller Way, Sellertown', '1000000001'),
('seller_2', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'seller2@example.com', '2 Seller Way, Sellertown', '1000000002'),
('seller_3', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'seller3@example.com', '3 Seller Way, Sellertown', '1000000003'),
('seller_4', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'seller4@example.com', '4 Seller Way, Sellertown', '1000000004'),
-- Buyers
('buyer_1', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer1@example.com', '1 Buyer Rd, Buyerville', '1000000011'),
('buyer_2', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer2@example.com', '2 Buyer Rd, Buyerville', '1000000012'),
('buyer_3', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer3@example.com', '3 Buyer Rd, Buyerville', '1000000013'),
('buyer_4', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer4@example.com', '4 Buyer Rd, Buyerville', '1000000014'),
('buyer_5', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer5@example.com', '5 Buyer Rd, Buyerville', '1000000015'),
('buyer_6', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer6@example.com', '6 Buyer Rd, Buyerville', '1000000016'),
('buyer_7', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer7@example.com', '7 Buyer Rd, Buyerville', '1000000017'),
('buyer_8', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer8@example.com', '8 Buyer Rd, Buyerville', '1000000018'),
('buyer_9', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer9@example.com', '9 Buyer Rd, Buyerville', '1000000019'),
('buyer_10', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer10@example.com', '10 Buyer Rd, Buyerville', '1000000020'),
('buyer_11', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer11@example.com', '11 Buyer Rd, Buyerville', '1000000021'),
('buyer_12', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer12@example.com', '12 Buyer Rd, Buyerville', '1000000022'),
('buyer_13', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer13@example.com', '13 Buyer Rd, Buyerville', '1000000023'),
('buyer_14', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer14@example.com', '14 Buyer Rd, Buyerville', '1000000024'),
('buyer_15', '$2a$10$SZBOAySceIgqvfOU2CDWJ.7ArK/Y/tj3u/kxUYKVE.r05Xum7Dug6', 'buyer15@example.com', '15 Buyer Rd, Buyerville', '1000000025');


-- INSERT ROLE TABLE:
INSERT INTO roles (role_name) VALUES ('ROLE_ADMIN'), ('ROLE_SELLER'), ('ROLE_BUYER');

-- ASSIGN ROLES FOR USER:
-- Admin gets all roles
INSERT INTO user_roles (user_id, role_id) VALUES 
(1, 1), (1, 2), (1, 3);

-- Sellers
INSERT INTO user_roles (user_id, role_id) VALUES 
(2, 2), (3, 2), (4, 2), (5, 2);

-- Buyers
-- Get ROLE_BUYER ID dynamically and assign it
INSERT INTO user_roles (user_id, role_id)
SELECT user_id, (SELECT role_id FROM roles WHERE role_name = 'ROLE_BUYER')
FROM users WHERE user_id >= 6;




-- INSERT CATEGORIES

INSERT INTO categories (name, description)
VALUES 
('Electronics', 'Gadgets and devices'),
('Books', 'Books and literature'),
('Clothing', 'Men and women clothing'),
('Home & Kitchen', 'Appliances and kitchenware'),
('Sports', 'Sports gear and equipment'),
('Toys', 'Toys for all ages'),
('Beauty', 'Beauty products and skincare'),
('Automotive', 'Car accessories'),
('Garden', 'Gardening tools and plants'),
('Music', 'Musical instruments and CDs');


-- FAKE 100 products

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 4, 'Managed optimal data-warehouse', 'Choice big everything add wear. Time discussion threat well. Wife yeah they heavy day once.', 
     643.03, 2, 'https://picsum.photos/seed/1/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 1, 'Phased optimizing policy', 'Red author inside true. Sure expect also above everyone raise. Mission sea job left model avoid manage.', 
     148.14, 7, 'https://picsum.photos/seed/2/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 9, 'Triple-buffered neutral capacity', 'Power girl camera guy himself. Exactly together send run test side. Entire measure practice turn clearly sound recognize.', 
     39.5, 14, 'https://picsum.photos/seed/3/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 8, 'Distributed bifurcated pricing structure', 'Form full simple parent eight improve. Have deal conference administration. Deep security whom newspaper.', 
     206.85, 42, 'https://picsum.photos/seed/4/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 6, 'Visionary 5thgeneration toolset', 'Strong far process public. Million poor score watch happy blood six. Prepare unit behavior message.', 
     593.37, 1, 'https://picsum.photos/seed/5/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 2, 'Decentralized intangible database', 'Summer hospital seat land bill page area interesting. Almost catch fear recently choose picture industry. Both I enter no under find.', 
     285.09, 14, 'https://picsum.photos/seed/6/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 1, 'Re-contextualized hybrid challenge', 'Around throw situation with brother moment. Board event hotel economic organization Democrat professor lawyer.', 
     386.13, 23, 'https://picsum.photos/seed/7/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 2, 'Managed high-level moratorium', 'Movement building traditional political. Green always now wide beyond. Many public term question stand north morning prevent.', 
     732.43, 35, 'https://picsum.photos/seed/8/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 2, 'Face-to-face uniform Graphical User Interface', 'Present job just. Practice help performance huge capital.', 
     556.52, 41, 'https://picsum.photos/seed/9/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 4, 'Customer-focused motivating matrix', 'Practice near war heart do discover article message. Reflect lot business food of.', 
     55.37, 15, 'https://picsum.photos/seed/10/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 6, 'Extended mission-critical contingency', 'Position tell change. After party to woman world brother prevent fast.', 
     867.82, 25, 'https://picsum.photos/seed/11/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 2, 'Streamlined multimedia infrastructure', 'Create visit magazine guy. Deal kitchen help third ever radio.', 
     171.03, 23, 'https://picsum.photos/seed/12/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 8, 'Configurable even-keeled installation', 'Road visit but education send city interest. Official sell five close. Receive his must. Something technology less raise seven meet.', 
     613.04, 11, 'https://picsum.photos/seed/13/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 1, 'Cross-group non-volatile installation', 'Lose join recognize movement. By fund government science. Wait professor range job wind eight soldier. Ready determine their ok believe rock huge.', 
     385.66, 41, 'https://picsum.photos/seed/14/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 5, 'Open-source mission-critical workforce', 'Although various explain any. Sit born cover city. Bit food world send.', 
     236.76, 3, 'https://picsum.photos/seed/15/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 8, 'Centralized human-resource projection', 'Place bar floor tree. Minute including environment. Walk seem option member.', 
     75.53, 37, 'https://picsum.photos/seed/16/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 5, 'Versatile bottom-line parallelism', 'It character practice north. Rather somebody throw hot.', 
     401.68, 42, 'https://picsum.photos/seed/17/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 10, 'Digitized multi-tasking hub', 'Brother teach sound season sport they purpose. Firm explain no that.', 
     148.23, 48, 'https://picsum.photos/seed/18/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 2, 'Customizable full-range knowledge user', 'Country job per less. Senior church western book. Appear sign vote local fall nice.', 
     405.41, 15, 'https://picsum.photos/seed/19/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 7, 'Face-to-face 5thgeneration productivity', 'Trial gun three. Defense level nice top actually forget. Radio head discover weight specific language.', 
     758.22, 8, 'https://picsum.photos/seed/20/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 9, 'Realigned stable middleware', 'Interview war sport feel political mention. These left music learn leg. Just common teacher per.', 
     600.44, 25, 'https://picsum.photos/seed/21/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 9, 'Object-based contextually-based paradigm', 'Mother account evening building both executive book. Foreign thing never help almost reduce professor. Discover help sing.', 
     258.9, 36, 'https://picsum.photos/seed/22/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 5, 'Front-line client-driven capability', 'Since newspaper poor growth reflect result. Part term anything.', 
     753.37, 50, 'https://picsum.photos/seed/23/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 9, 'Up-sized tertiary knowledgebase', 'Company often special involve really factor its worker. Just trip stage policy.', 
     440.42, 30, 'https://picsum.photos/seed/24/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 9, 'Re-engineered intangible interface', 'Realize official front word through. Onto wish chance ready dark stop.', 
     764.34, 33, 'https://picsum.photos/seed/25/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 9, 'Object-based analyzing flexibility', 'Difficult miss author machine. My produce son class.', 
     612.88, 10, 'https://picsum.photos/seed/26/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 8, 'Managed modular monitoring', 'Administration practice price let. Our fast lot view concern. Once many pattern positive ability wear score.', 
     953.96, 34, 'https://picsum.photos/seed/27/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 1, 'Front-line explicit Graphic Interface', 'Accept recognize girl to become why. Child draw forget can want.', 
     29.28, 24, 'https://picsum.photos/seed/28/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 8, 'Customer-focused contextually-based benchmark', 'Short social put good across plan whole. Me usually agree eight usually bank plant. Gun keep summer truth level bring point. Example old listen weight exist modern place.', 
     248.46, 37, 'https://picsum.photos/seed/29/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 8, 'Streamlined content-based approach', 'Executive rate check financial guess perhaps bill. Half side human high discover list brother. Character let black.', 
     817.86, 49, 'https://picsum.photos/seed/30/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 4, 'Mandatory background customer loyalty', 'Mother hand show campaign area expect on believe. Those sea create establish part money.', 
     947.38, 11, 'https://picsum.photos/seed/31/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 7, 'Grass-roots value-added capacity', 'Degree shake wear. Soon long sit morning rate.', 
     929.62, 49, 'https://picsum.photos/seed/32/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 9, 'Upgradable content-based frame', 'Before grow national red camera she. Five collection little.', 
     995.2, 42, 'https://picsum.photos/seed/33/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 6, 'Phased contextually-based encryption', 'Continue training church foreign. How account wife improve night sometimes carry lawyer. Within child tend stay three letter debate majority.', 
     456.97, 16, 'https://picsum.photos/seed/34/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 1, 'Business-focused encompassing concept', 'Check the free. Another offer various executive until.', 
     30.82, 36, 'https://picsum.photos/seed/35/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 2, 'Multi-lateral solution-oriented capability', 'Cold ground really west. Mind PM probably choose bank back dog. Bag maintain former capital third money black.', 
     80.28, 41, 'https://picsum.photos/seed/36/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 5, 'Multi-layered bandwidth-monitored monitoring', 'Effort none federal. Walk as exist official job.', 
     906.37, 22, 'https://picsum.photos/seed/37/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 4, 'Extended intangible ability', 'Feel support series reduce black. Which month reality ability professional indeed tell. Eye crime sure themselves more war certain. Practice stuff worry agreement evidence.', 
     672.29, 14, 'https://picsum.photos/seed/38/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 2, 'Cross-group bifurcated attitude', 'On get there toward.', 
     786.77, 27, 'https://picsum.photos/seed/39/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 8, 'Stand-alone background synergy', 'Watch piece PM represent heart beyond.', 
     662.39, 23, 'https://picsum.photos/seed/40/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 7, 'Automated optimal support', 'Identify name south state. Us over figure trade west. Most center movement how point door sell. Lawyer factor heavy anything notice.', 
     865.2, 4, 'https://picsum.photos/seed/41/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 4, 'Diverse fault-tolerant adapter', 'Dark during job ahead necessary. Thought account candidate lot government project.', 
     730.93, 7, 'https://picsum.photos/seed/42/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 5, 'Distributed well-modulated monitoring', 'Tv short evidence visit. How away believe area war focus.', 
     540.92, 9, 'https://picsum.photos/seed/43/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 1, 'Future-proofed client-driven neural-net', 'Able card support trade may anyone by. Soon than speak show see.', 
     468.0, 5, 'https://picsum.photos/seed/44/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 4, 'Versatile zero tolerance methodology', 'Despite at participant. Country send yard mother son. Own power well school capital.', 
     655.62, 35, 'https://picsum.photos/seed/45/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 7, 'De-engineered responsive capacity', 'Number student another miss article there. Maybe before pull great. Yet spend stay exist little.', 
     174.65, 32, 'https://picsum.photos/seed/46/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 7, 'Diverse value-added hierarchy', 'Staff draw table fast another analysis. Hard also I above.', 
     903.42, 11, 'https://picsum.photos/seed/47/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 9, 'Configurable zero-defect algorithm', 'Speech key senior impact. Focus check kitchen early very operation. Girl as west institution country they.', 
     272.55, 30, 'https://picsum.photos/seed/48/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 5, 'Business-focused bifurcated task-force', 'International position early middle cover someone identify. Really lay at nearly anyone. Until any computer still than interest.', 
     665.25, 32, 'https://picsum.photos/seed/49/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 1, 'Multi-tiered human-resource monitoring', 'Know question ability gas peace grow. Produce through politics leg pull nor lose. Less party camera.', 
     225.52, 4, 'https://picsum.photos/seed/50/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 9, 'Optional user-facing framework', 'Buy author fly few. Inside meeting hundred agency teach message.', 
     59.64, 31, 'https://picsum.photos/seed/51/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 4, 'Cloned impactful concept', 'Would example lot religious west.', 
     89.31, 12, 'https://picsum.photos/seed/52/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 10, 'Integrated tertiary task-force', 'Say support yeah issue. Sign lose important model. Green recognize pick law writer increase sometimes. Rate measure machine pick church occur kind.', 
     409.74, 37, 'https://picsum.photos/seed/53/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 4, 'Progressive content-based parallelism', 'Age open great sell market. Huge research lay happy official hour. Off area white deal happen.', 
     91.16, 43, 'https://picsum.photos/seed/54/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 7, 'Synergistic interactive analyzer', 'Prevent choice result audience generation current. Song team political character. Produce positive blood company second region financial future. Director edge send car debate season situation.', 
     673.03, 21, 'https://picsum.photos/seed/55/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 6, 'Stand-alone 24/7 moratorium', 'Particular positive east today agency quickly task. Which work power yeah.', 
     139.57, 42, 'https://picsum.photos/seed/56/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 10, 'Upgradable stable task-force', 'Nothing open citizen get. Control me set learn model station. Use thus north control.', 
     929.73, 5, 'https://picsum.photos/seed/57/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 9, 'Integrated bandwidth-monitored matrices', 'Concern science no view. Move relate west party best into start. Voice measure past future man yard. Pattern ready area direction.', 
     998.47, 7, 'https://picsum.photos/seed/58/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 6, 'Enhanced reciprocal encoding', 'Us stuff leave like subject my win happy. Change ahead cold hard hundred such hospital. Safe store former whose behind system traditional. Leader green give church.', 
     272.55, 23, 'https://picsum.photos/seed/59/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 9, 'Function-based motivating productivity', 'Three support quite discussion large. Talk smile decide far.', 
     292.14, 29, 'https://picsum.photos/seed/60/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 5, 'Expanded bottom-line leverage', 'Voice rich network big travel concern feeling matter. Organization information for not guy.', 
     306.38, 43, 'https://picsum.photos/seed/61/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 5, 'Ergonomic next generation moratorium', 'Various eight be ahead actually apply. White against court data serious and dark. Skin receive industry final how add certainly game.', 
     124.27, 7, 'https://picsum.photos/seed/62/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 5, 'Balanced bottom-line protocol', 'Mouth contain example month score short decide. Consider key their simple improve do factor. Short before skin second another lawyer yes name.', 
     608.78, 46, 'https://picsum.photos/seed/63/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 7, 'De-engineered heuristic parallelism', 'Speak and start. Effect win bar push sing begin according. Standard stop her seem officer machine would ready. Certainly move lay heart stock.', 
     510.35, 17, 'https://picsum.photos/seed/64/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 3, 'Synergistic regional system engine', 'Page one toward evidence through start. Anyone inside notice. Model wide agent trip government senior discuss.', 
     831.05, 3, 'https://picsum.photos/seed/65/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 9, 'Inverse interactive product', 'Modern first radio law ahead between economy image.', 
     640.74, 17, 'https://picsum.photos/seed/66/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 2, 'Virtual regional synergy', 'Career prove shoulder public significant answer. Could recent travel. Simply recently mother above alone win. Eye reason approach point quality effort hear.', 
     708.61, 36, 'https://picsum.photos/seed/67/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 6, 'Ergonomic full-range structure', 'Politics join government smile. Drop energy where talk professional four already. Congress stuff tonight worry member certain.', 
     945.6, 45, 'https://picsum.photos/seed/68/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 1, 'Object-based homogeneous array', 'Thank seek could toward she speech. Almost north blood professional during.', 
     586.68, 10, 'https://picsum.photos/seed/69/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 4, 'Up-sized static interface', 'Building money reduce provide campaign TV bill.', 
     315.18, 3, 'https://picsum.photos/seed/70/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 4, 'Upgradable solution-oriented monitoring', 'Since military say see up. Arrive increase term important against though this produce.', 
     670.26, 23, 'https://picsum.photos/seed/71/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 3, 'Object-based foreground circuit', 'Fill size product organization. Truth agent audience next mind.', 
     865.96, 12, 'https://picsum.photos/seed/72/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 5, 'Re-contextualized demand-driven hub', 'Reality system will those fear. Enjoy mother picture skill.', 
     739.2, 22, 'https://picsum.photos/seed/73/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 1, 'Visionary intangible conglomeration', 'Music sister able. Institution admit notice thought ability truth. Letter suggest firm space treat or effect popular.', 
     167.61, 45, 'https://picsum.photos/seed/74/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 6, 'Synergistic foreground website', 'Spring director eye kid state begin. Finally rock control bad person realize yeah.', 
     860.01, 15, 'https://picsum.photos/seed/75/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 4, 'Re-contextualized intangible model', 'Defense listen account hair trade throughout agency. Street color from response.', 
     312.14, 15, 'https://picsum.photos/seed/76/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 6, 'Customizable intangible methodology', 'Like trip option alone rise accept same. Name popular hit between probably six ago.', 
     404.48, 18, 'https://picsum.photos/seed/77/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 2, 'Team-oriented national paradigm', 'Through approach red. Professor production long three sea travel forget their.', 
     645.07, 26, 'https://picsum.photos/seed/78/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 1, 'Quality-focused modular Local Area Network', 'Trouble cell mouth federal push PM buy of. Office how three identify test campaign along. Argue federal central.', 
     878.27, 17, 'https://picsum.photos/seed/79/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 7, 'Synchronized optimizing system engine', 'Stand something million have deal fund day. Set group among million type.', 
     117.32, 28, 'https://picsum.photos/seed/80/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 10, 'Operative systemic open system', 'Low including time area. Manager after wait indicate bed yard.', 
     610.15, 33, 'https://picsum.photos/seed/81/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 9, 'Robust client-server help-desk', 'Not such likely nothing group think. Sit floor stand recognize too population this clear.', 
     198.18, 3, 'https://picsum.photos/seed/82/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 7, 'Customer-focused web-enabled forecast', 'Determine heart return morning.', 
     926.32, 35, 'https://picsum.photos/seed/83/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 2, 'Sharable asymmetric firmware', 'Head general recognize consider growth. Notice option moment plant.', 
     79.27, 43, 'https://picsum.photos/seed/84/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 6, 'Reduced leadingedge pricing structure', 'State point summer tell. Or appear bag west as treatment.', 
     722.56, 20, 'https://picsum.photos/seed/85/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 7, 'Devolved executive process improvement', 'Individual because science them country. Church politics six business condition recognize. Again trial fire range surface.', 
     408.38, 19, 'https://picsum.photos/seed/86/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 7, 'Switchable intermediate success', 'Page service central fight cold also. After expect learn plant strong speech.', 
     668.28, 25, 'https://picsum.photos/seed/87/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 4, 'Mandatory system-worthy array', 'Somebody truth rate have there development ok. Consumer peace case dog leg people. Per marriage partner fall task boy. Capital behind onto stand when.', 
     552.46, 1, 'https://picsum.photos/seed/88/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 8, 'Visionary logistical knowledge user', 'Total hour call loss cold. Member case anything surface concern each.', 
     435.59, 38, 'https://picsum.photos/seed/89/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 2, 'Programmable national definition', 'Maintain stock leader might item. Blue clear determine note behavior condition.', 
     447.74, 14, 'https://picsum.photos/seed/90/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 4, 'Cross-platform encompassing structure', 'Hundred usually team understand go ever answer. Check keep form suddenly consider clear early life.', 
     290.95, 43, 'https://picsum.photos/seed/91/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 1, 'Right-sized executive help-desk', 'Authority receive partner.', 
     676.07, 15, 'https://picsum.photos/seed/92/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 7, 'Reverse-engineered zero-defect synergy', 'Republican item occur better everybody during. Present send adult process. Base at single understand common able development.', 
     55.75, 31, 'https://picsum.photos/seed/93/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 8, 'Pre-emptive maximized standardization', 'Really front history decide. Tonight example on born site.', 
     887.28, 37, 'https://picsum.photos/seed/94/600/400', 'INACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 7, 'Networked optimal benchmark', 'Left thing up visit. Place about do office shoulder page.', 
     405.66, 10, 'https://picsum.photos/seed/95/600/400', 'ACTIVE');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (2, 9, 'De-engineered contextually-based open architecture', 'Ok magazine compare we best.', 
     226.65, 45, 'https://picsum.photos/seed/96/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (3, 8, 'Grass-roots dynamic matrix', 'Protect help simple center catch where. Political pull even process church. Car off serious after share.', 
     256.71, 8, 'https://picsum.photos/seed/97/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 10, 'Visionary upward-trending extranet', 'Special likely him.', 
     670.9, 36, 'https://picsum.photos/seed/98/600/400', 'SOLD_OUT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (5, 3, 'Face-to-face human-resource solution', 'Science newspaper worker human war. Environmental available interest sort past. Product window myself real plant.', 
     816.86, 33, 'https://picsum.photos/seed/99/600/400', 'DRAFT');

INSERT INTO products 
    (seller_id, category_id, name, description, price, stock_quantity, image_url, status) 
    VALUES 
    (4, 4, 'Integrated optimizing archive', 'Expect message station story. Senior realize organization much specific air.', 
     746.22, 31, 'https://picsum.photos/seed/100/600/400', 'DRAFT');
