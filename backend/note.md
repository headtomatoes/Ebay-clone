**I. Standard E-commerce Purchase Flow**

1.  **Login:** User authenticates their account.
2.  **Product Discovery:** User browses or searches for products.
3.  **Select Product:** User views the details of a specific product.
4.  **Add to Cart:** User adds the selected product to their shopping cart. (Note: This action *does not* create an order yet).
5.  **View/Manage Cart:** User navigates to the Cart Page.
    * View current items in the cart.
    * Modify quantities.
    * Remove items.
6.  **Initiate Checkout:** User clicks the "Checkout" button from the cart page.
7.  **Checkout Page:** User is redirected to the checkout page.
    * Backend conceptually prepares cart items for order creation.
    * User fills in/confirms required information:
        * Shipping Address (auto-filled if previously saved).
        * Select Payment Method (e.g., Stripe integration).
8.  **Place Order:** User clicks the "Place Order" button.
    * Backend validates information, processes payment (via Stripe), creates the `Order` and associated `Order Items` records based on the cart contents.
    * Cart is cleared (both backend `cart_items` and frontend Local Storage).
9.  **Order Confirmation/History:** User is redirected to their Order History page, showing the newly placed order with its initial status (e.g., 'Pending', 'Processing', 'Paid'). Orders progress through various statuses over time.

**II. Auction Flow - Seller Perspective**

1.  **Login:** Seller authenticates their account.
2.  **Product Management:** Seller ensures the product they want to auction exists.
    * Create a new product if it doesn't exist (initially perhaps in 'Draft' status).
    * Select an existing product.
3.  **Initiate Auction Creation:** Seller chooses to create an auction for a specific product. The product status might change (e.g., to 'Inactive' or a specific 'Auction_Prep' status).
4.  **Configure Auction Parameters:** Seller sets the details for the auction:
    * Start Time / Date
    * End Time / Date
    * Starting Bid Price
    * Reserve Price (optional minimum price to sell)
    * Buy It Now Price (optional)
    * Bid Increments (optional)
5.  **Create Auction:** Seller submits the form.
    * An `Auction` record is created with status 'Scheduled'.
    * The associated `Product` status is confirmed (e.g., 'Inactive' - meaning available only via this upcoming/active auction).

**III. Auction Flow - Bidder Perspective**

1.  **Login:** Bidder authenticates their account.
2.  **Browse Auctions:** Bidder navigates to the auction listings page (showing auctions with 'Scheduled' or 'Active' status).
3.  **Select Auction:** Bidder chooses a specific active auction/product to view.
4.  **Place Bid:** Bidder enters a bid amount (must be higher than the current highest bid and meet any increment rules) and clicks the "Bid" button.
    * System validates the bid.
    * If valid, the bid is recorded, and the auction's current price/highest bidder is updated.
5.  **Auction End:** The auction concludes based on its End Time.
6.  **System Processing:** The system determines the outcome:
    * **Winner:** If the highest bid meets or exceeds the reserve price (and bids exist).
    * **No Winner (Reserve Not Met):** If bids were placed, but none met the reserve price.
    * **No Winner (No Bids):** If no bids were placed.
7.  **Notifications:** The system notifies relevant parties:
    * Seller: Informed of the outcome (winner/price, reserve not met, no bids, cancellation).
    * Winning Bidder: Informed they won and the final price.
    * (Optional: Outbid bidders could also be notified).
8.  **Order Creation (for Winner):** If there's a winner:
    * The system automatically creates an `Order` and `Order Item` for the winning bidder at the winning price.
    * This order bypasses the cart and appears directly in the winner's Order History, likely with a status like 'Pending Payment' or 'Action Required'.
    * The `Product` status might change to 'Sold_Out' or another appropriate status.
    * The `Auction` status updates (e.g., 'Ended_Met_Reserve').

**IV. Status Definitions**

* **Product Statuses:**
    * `Active`: Available for direct purchase via standard cart flow. Visible in general product listings.
    * `Sold_Out`: Visible in listings but cannot be added to cart (inventory = 0).
    * `Draft`: Created by seller, not visible to buyers/bidders. Only accessible in the seller's dashboard.
    * `Inactive`: Designated for or currently part of an auction. Not available for standard cart purchase. Visible only on auction pages when the associated auction is `Scheduled` or `Active`.

* **Auction Statuses:**
    * `Scheduled`: Auction created but the start time has not yet been reached.
    * `Active`: Auction start time has passed, and the end time has not been reached. Bids are accepted.
    * `Ended_Met_Reserve`: Auction end time passed, and the highest bid met or exceeded the reserve price. A winner exists.
    * `Ended_Not_Met_Reserve`: Auction end time passed, bids were placed, but the highest bid did not meet the reserve price. No sale occurred through the auction. Product status might revert.
    * `Ended_No_Bids`: Auction end time passed, and no bids were placed. No sale occurred. Product status might revert.
    * `Cancelled`: Manually cancelled by the seller before the scheduled end time. Product status reverts (e.g., to `Draft` or `Active`, depending on defined rules).

**V. Data Handling Specifics**

* **Cart Items (Responsibility: Nhat Anh):**
    * **Frontend (FE):** Uses Local Storage (LS) to store cart items locally for persistence within the user's browser session/across visits.
    * **Backend (BE) Sync:** FE sends the LS cart data to the BE upon certain triggers (e.g., login, viewing cart page, adding/modifying items?).
    * **BE Storage:** BE saves/updates the cart data in a dedicated `cart_items` table associated with the logged-in user ID. This table acts as the persistent, authoritative source once synced.
    * **Checkout Transition:** When checkout is initiated and completed:
        1.  BE validates the cart.
        2.  BE transfers data from `cart_items` to create `order_items`.
        3.  BE creates the `order` record.
        4.  BE deletes the user's records from the `cart_items` table.
        5.  BE sends a signal to FE to clear the cart from LS.
    * **Abandonment:** If the user doesn't complete checkout, items remain in LS. BE `cart_items` reflect the last synced state. (Need clear logic on when BE `cart_items` are cleared if not via checkout - e.g., TTL, explicit user action, next login sync overwrites?). The statement "delete in BE and continue to store on LS" if not buying needs clarification; typically, LS might repopulate from BE on login if BE data is considered the master source after initial sync.

* **Order & Order Items (Responsibility: Hung):**
    * Orders are created either from `cart_items` (standard purchase) or directly from an `Auction` result (winning bid).
    * Each `Order` links to one or more `Order Items`, specifying product, quantity, and price paid.
    * Orders contain shipping, billing, status, and payment details.
    * **Payment Method:** Stripe integration is planned. Payment processing occurs during the 'Place Order' step for standard purchases, or potentially as a separate step after an auction win before the order status advances.
    * Orders have multiple lifecycle statuses (e.g., `Pending Payment`, `Processing`, `Shipped`, `Delivered`, `Cancelled`, `Refunded`).

This structured overview should provide a clear picture of the intended functionality.