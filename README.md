
# Ebay-clone

**Course:** WEB APPLICATION DEVELOPMENT IT093IU

**University:** VIET NAM NATIONAL UNIVERSITY – HO CHI MINH CITY INTERNATIONAL UNIVERSITY

**Term:** Spring 2025

**Team 99% Gambler Members :**
*   Đàm Nguyễn Trọng Lễ - ITITIU22240 - (Leader - Full-stack)
*   Nguyễn Quốc Trung - ITITIU22171 - (Frontend Developer)
*   Lê Hưng - ITCSIU22271 - (Backend Developer (Database focus)])
*   Lê Nhật Anh - ITCSIU22254 - (Backend Developer)

---

## 📖 Table of Contents

*   [About The Project](#about-the-project)
*   [✨ Features](#-features)
*   [📸 Screenshots/Demo](#-screenshotsdemo)
*   [🛠️ Tech Stack](#️-tech-stack)
*   [🚀 Getting Started](#-getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Running the Project](#running-the-project)
*   [⚙️ Configuration](#️-configuration)
*   [📂 Folder Structure](#-folder-structure)
*   [📄 API Endpoints](#-api-endpoints)
*   [🌐 Deployment](#-deployment)
*   [🤔 Known Issues/Future Improvements](#-known-issuesfuture-improvements)
*   [🤝 Contributing](#-contributing)
*   [📜 License](#-license)
*   [🙏 Acknowledgements](#-acknowledgements)
*   [📧 Contact](#-contact)

---

## ℹ️ About The Project

This project is an **e-commerce and auction platform**, inspired by eBay, designed to enable users to buy and sell a wide variety of goods. It aims to create a dynamic online marketplace where individuals and potentially small sellers can list items, and buyers can engage in direct purchases or competitive bidding. The target audience includes general consumers, collectors, and individuals looking to easily transact goods online. As always this is just the project to **consolidate** the foundation **knowledge** about web-app development

---

## ✨ Features

1. User Registration & Login (JWT Auth)
2. Sellers can list Products (Direct Buy or Auction)
3. Users can browse/search Products
4. Users can view Product Details
5. Users can place Bids on Auctions (Real-time updates)
6. Users can directly buy "Direct Buy" items
7. Basic indication of won/purchased items 
8. Basic Feedback system after a transaction.

---

## 📸 Screenshots/Demo

**Live Demo Link :** [For now just Local host only]

### Homepage

![Pasted image 20250602040644](https://github.com/user-attachments/assets/e55b6731-f12e-4ece-8d56-553eb89251b5)

### Product Page

![Pasted image 20250602040702](https://github.com/user-attachments/assets/3928941b-b5ad-470f-b44d-e08d9fea49c9)

### Bidding Page
![Pasted image 20250602040716](https://github.com/user-attachments/assets/a0be2026-af6b-45ea-96b5-1b77b8fef4fb)


---

## 🛠️ Tech Stack

List the major technologies, frameworks, and libraries used.

*   Frontend:  
    *   React 19.0.0  
    *   React DOM 19.0.0  
    *   Vite 6.2.0  
    *   Tailwind CSS 3.4.17  
    *   PostCSS 8.5.3  
    *   Autoprefixer 10.4.21  
    *   Axios 1.9.0  
    *   React Router DOM 7.5.0  
    *   Date-fns 4.1.0  
    *   SockJS Client 1.6.1  
    *   @stomp/stompjs 7.1.1  
    *   React Toastify 11.0.5  
    *   @stripe/stripe-js 7.3.0  
    *   @stripe/react-stripe-js 3.7.0  
*   Backend:  
    *   Java 21  
    *   Jakarta EE  
    *   Spring Boot  
    *   Spring MVC  
    *   Spring Data JPA  
*   Linters/Formatters:  
    *   ESLint 9.21.0  
    *   @eslint/js 9.21.0  
    *   eslint-plugin-react-hooks 5.1.0  
    *   eslint-plugin-react-refresh 0.4.19  
*   Package Manager:  
    *   npm  
*   Build Tools:  
    *   Maven
*   Database:  
    *   MySQL
*   IDE:  
    *   IntelliJ IDEA, VSC

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What software needs to be installed beforehand?
*   Node.js (v>= 18.x) 
*   npm (usually comes with Node.js)
*   Java JDK 21  
*   Apache Maven
*   MySQL server 
*   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/headtomatoes/Ebay-clone
    cd Ebay-clone
    ```

2.  **Install Frontend Dependencies :**
    ```bash
    cd frontend
    npm install
    cd .. 
    ```

3.  **Install Backend Dependencies :**
    ```bash
    cd backend 
    mvn install
    cd ..
    ```

4.  **Set up Environment Variables:**
    Create a `.env` file in the root directory 
    Copy the contents from `.env.example`  and fill in your credentials/keys.
```env
# This is a template/example .env file. 
# Replace placeholder values with your actual credentials.
DB_URL=jdbc:mysql://<DB_HOST>:<DB_PORT>/<YOUR_DATABASE_NAME>
DB_USERNAME=<YOUR_DB_USERNAME>
DB_PASSWORD=<YOUR_DB_PASSWORD>

# MYSQL_ROOT_PASSWORD is typically for setting up the MySQL server itself,
# not directly used by the Spring Boot app unless it's managing the DB setup.
MYSQL_ROOT_PASSWORD=<YOUR_MYSQL_ROOT_PASSWORD>

JWT_SECRET=<YOUR_STRONG_JWT_SECRET_KEY_BASE64_ENCODED>
JWT_EXPIRATION_MS=86400000 # (24 hours)

GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
GOOGLE_REDIRECT_URI=http://localhost:8082/login/oauth2/code/google # Or your deployed app's redirect URI

EMAIL_USER=<YOUR_EMAIL_ADDRESS_FOR_SENDING_MAIL>
EMAIL_PASS=<YOUR_EMAIL_APP_PASSWORD_OR_OAUTH_TOKEN> # Use an App Password for Gmail if 2FA is enabled

STRIPE_API_KEY_PUBLISHABLE=pk_test_<YOUR_STRIPE_PUBLISHABLE_KEY_SUFFIX> # Example: pk_test_xxxxxxxxxxxx
STRIPE_API_KEY_SECRET=sk_test_<YOUR_STRIPE_SECRET_KEY_SUFFIX>       # Example: sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_<YOUR_STRIPE_WEBHOOK_SIGNING_SECRET>   # Example: whsec_xxxxxxxxxxxx

FRONTEND_URL=http://localhost:5173 # Adjust if your Vite frontend runs on a different port

# Optional overrides with defaults in application.properties
SERVER_PORT=8082
DDL_AUTO=validate # (e.g., validate, update, create, create-drop)
SHOW_SQL=true
APP_DEBUG=true
MAIL_DEBUG=true ```
```
    
    **Note:** Ensure `.env` is listed in your `.gitignore` file to prevent committing sensitive information.

### Running the Project

1.  **Start the Backend Server:**
    ```bash
    # In the backend directory
    cd backend
    mvn spring-boot:run
    ```
    The backend server will typically run on `http://localhost:[BACKEND_PORT]`.

2.  **Start the Frontend Development Server (if applicable):**
    ```bash
    # In the frontend directory
	cd frontend
    npm run dev # or npm start, yarn start
    ```
    The frontend development server will typically run on `http://localhost:[FRONTEND_PORT]`.

3.  Open your browser and navigate to `http://localhost:[FRONTEND_PORT]` (or whichever port your frontend is running on).

---

## ⚙️ Configuration

"The application uses environment variables for configuration. Ensure you have a `.env` file in the root directory with the following variables set:
- `DB_URL`: The full JDBC connection string for the MySQL database, including host, port, and database name.
- `DB_USERNAME`: The username for connecting to the database specified in DB_URL.
- `DB_PASSWORD`: The password for the DB_USERNAME to access the database.
- `MYSQL_ROOT_PASSWORD`: The root password for the MySQL server instance. Primarily used for server setup and administration, not typically by the application for daily operations.
- `JWT_SECRET`: The secret key used for signing and verifying JSON Web Tokens (JWTs) for user authentication. This should be a long, random, and strong string, preferably Base64 encoded.
- `JWT_EXPIRATION_MS`: The expiration time for JWTs in milliseconds (e.g., 86400000 for 24 hours).
- `GOOGLE_CLIENT_ID`: The Client ID obtained from Google Cloud Console for OAuth 2.0 authentication.
- `GOOGLE_CLIENT_SECRET`: The Client Secret obtained from Google Cloud Console for OAuth 2.0 authentication.
- `GOOGLE_REDIRECT_URI`: The URI to which Google will redirect the user after successful OAuth 2.0 authentication. This must be registered in your Google Cloud Console.    
- `EMAIL_USER`: The username (often an email address) for the email account used by the application to send emails (e.g., notifications, password resets).
- `EMAIL_PASS`: The password for the EMAIL_USER account. For services like Gmail with 2FA, this should be an App Password.    
- `STRIPE_API_KEY_PUBLISHABLE`: Stripe's publishable API key, safe to use in client-side code (e.g., frontend JavaScript) for tasks like creating tokens.
- `STRIPE_API_KEY_SECRET`: Stripe's secret API key, used for server-side API calls that require authentication (e.g., creating charges). Must be kept confidential.
- `STRIPE_WEBHOOK_SECRET`: Stripe's webhook signing secret, used to verify the authenticity of incoming webhook events from Stripe.
- `FRONTEND_URL`: The base URL of the frontend application (e.g., for CORS configuration or constructing redirect links).
- `SERVER_PORT`: The port on which the backend application server (Spring Boot) will run.
- `DDL_AUTO`: Hibernate's DDL (Data Definition Language) auto-generation strategy (e.g., validate, update, create, create-drop).
- `SHOW_SQL`: If true, Hibernate will log all executed SQL statements to the console. Useful for debugging.
- `APP_DEBUG`: A general application-level debug flag. If true, may enable more verbose logging or other debugging features within the application.
- `MAIL_DEBUG`: If true, enables verbose debug output for JavaMail, helping to troubleshoot email sending issues.

---

## 📂 Folder Structure

```
Ebay-clone/  
├── frontend/  
│   ├── public/  
│   ├── src/  
│   │   ├── components/  
│   │   ├── assets/  
│   │   ├── contexts/  
│   │   ├── routes/  
│   │   ├── services/  
│   │   ├── pages/  
│   │   ├── App.jsx  
│   │   └── main.jsx  
│   ├── package.json  
│   └── vite.config.js  
├── backend/
│   ├── src/  
│   │   ├── main/  
│   │   │   ├── java/  
│   │   │   │   └── com/99_gambler/ebay_clone/  
│   │   │   │       ├── controller/  
│   │   │   │       ├── service/  
│   │   │   │       ├── repository/  
│   │   │   │       ├── entity/  
│   │   │   │       ├── dto/
│   │   │   │       ├── config/
│   │   │   │       ├── security/
│   │   │   │       ├── exception/
│   │   │   │       ├── EbayCloneApplication.java  
│   │   │   │       ├── ServletInitializer.java  
│   │   │   │       └── EnvLoader.java  
│   │   │   └── resources/  
│   │   │       ├── static/  
│   │   │       ├── templates/  
│   │   │       └── application.properties  
│   └── pom.xml
├── .gitignore  
└── README.md
```

---

## 📄 API Endpoints 

List of backend API,  the main endpoints and their functionalities.

| Method | Endpoint                                               | Description                                             | Auth Required      |
| ------ | ------------------------------------------------------ | ------------------------------------------------------- | ------------------ |
| GET    | /api/public/products                                   | Get a list of all public products                       | No                 |
| POST   | /api/public/products                                   | Create a new product (by an admin/seller)               | Yes (Seller)       |
| GET    | /api/public/products/search                            | Search public products                                  | No                 |
| GET    | /api/public/products/seller                            | Get products listed by a specific seller                | Yes (Seller/User)  |
| GET    | /api/public/products/{id}                              | Get a specific public product by ID                     | No                 |
| PUT    | /api/public/products/{id}                              | Update a specific product by ID                         | Yes (Owner/Admin)  |
| DELETE | /api/public/products/{id}                              | Delete a specific product by ID                         | Yes (Owner/Admin)  |
| PUT    | /api/public/products/{id}/status                       | Update the status of a specific product                 | Yes (Owner/Admin)  |
| PUT    | /api/payments/cod/{paymentId}/status                   | Update the status of a Cash On Delivery payment         | Yes (Admin/Seller) |
| POST   | /api/payments/initiate                                 | Initiate a payment process                              | Yes (User)         |
| POST   | /api/payments/stripe/webhook                           | Handle incoming Stripe webhook events                   | No (Signature Key) |
| GET    | /api/public/auctions                                   | Get a list of all public auctions                       | No                 |
| POST   | /api/public/auctions                                   | Create a new auction                                    | Yes (Seller)       |
| GET    | /api/public/auctions/{auctionId}                       | Get a specific public auction by ID                     | No                 |
| GET    | /api/public/auctions/{auctionId}/bids                  | Get all bids for a specific auction                     | No                 |
| POST   | /api/public/auctions/{auctionId}/bids                  | Place a bid on a specific auction                       | Yes (User)         |
| GET    | /api/public/categories                                 | Get a list of all public product categories             | No                 |
| GET    | /api/cart                                              | Get the current user's shopping cart                    | Yes (User)         |
| POST   | /api/cart/add                                          | Add an item to the current user's shopping cart         | Yes (User)         |
| DELETE | /api/cart/clear                                        | Clear all items from the user's shopping cart           | Yes (User)         |
| DELETE | /api/cart/remove                                       | Remove an item from the user's shopping cart            | Yes (User)         |
| GET    | /api/orders                                            | Get a list of the current user's orders                 | Yes (User)         |
| POST   | /api/orders/from-cart                                  | Create a new order from the user's shopping cart        | Yes (User)         |
| GET    | /api/orders/from-cart/all                              | Get all orders (likely for admin or detailed user view) | Yes (User/Admin)   |
| GET    | /api/orders/{orderId}                                  | Get a specific order by ID                              | Yes (Owner/Admin)  |
| DELETE | /api/orders/{orderId}                                  | Delete/Cancel a specific order by ID                    | Yes (Owner/Admin)  |
| GET    | /api/auth/oauth2/failure                               | OAuth2 authentication failure callback                  | No                 |
| GET    | /api/auth/oauth2/success                               | OAuth2 authentication success callback                  | No                 |
| POST   | /api/auth/reset-password                               | Request a password reset                                | No                 |
| POST   | /api/auth/signin                                       | Sign in an existing user                                | No                 |
| POST   | /api/auth/signup                                       | Register (sign up) a new user                           | No                 |
| POST   | /api/public/reviews                                    | Submit a new product review                             | Yes (User)         |
| GET    | /api/public/reviews/product/{productId}                | Get all reviews for a specific product                  | No                 |
| GET    | /api/public/reviews/product/{productId}/average-rating | Get the average rating for a specific product           | No                 |
| POST   | /api/user/change-password                              | Change the current user's password                      | Yes (User)         |
| GET    | /api/user/me                                           | Get the current authenticated user's details            | Yes (User)         |
| PUT    | /api/user/me                                           | Update the current authenticated user's details         | Yes (User)         |

## 🌐 Deployment(Null for now)

---

## 🤔 Known Issues/Future Improvements

*   **Known Issues:**
    *   [ User profile picture upload sometimes fails on slow connections.]
    *   [ Search functionality is case-sensitive.]
*   **Future Improvements:**
    *   [ Implement real-time chat functionality using WebSockets.]
    *   [ Add two-factor authentication.]
    *   [ Internationalization (i18n) support.]

---

## 🤝 Contributing 


Contributions are welcome! If you'd like to contribute, please follow these steps:
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Please ensure your code adheres to the project's coding standards (e.g., run linters).

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE.md` file for details.

---

## 🙏 Acknowledgements

*   [Assoc. Prof. Nguyen Van Sinh] - For guidance and support.
* **React Official Documentation:** [https://react.dev/](https://react.dev/) 
* **Vite Official Documentation:** [https://vite.dev/](https://vite.dev/) 
* **General Tutorials:** YouTube (as a source for learning) 
* **Spring Framework Official Site:** [https://spring.io/](https://spring.io/) 
* **Spring Boot Documentation:** [https://docs.spring.io/spring-boot/index.html](https://docs.spring.io/spring-boot/index.html) 
* **Spring Initializr (Project Generator):** [https://start.spring.io/](https://start.spring.io/) 
* **Spring Framework WebSocket Documentation:** [https://docs.spring.io/spring-framework/reference/web/websocket.html](https://docs.spring.io/spring-framework/reference/web/websocket.html) 
* **JWT Official Site & Debugger:** [https://jwt.io/](https://jwt.io/) 
* **Google Cloud Console (for setup):** [https://console.cloud.google.com/](https://console.cloud.google.com/) 
* **Stripe Official Site:** [https://stripe.com/](https://stripe.com/)  
* **Main Idea & UI Reference:** [https://www.ebay.com/](https://www.ebay.com/)  
* **Postman:** [https://www.postman.com/](https://www.postman.com/)  
* **MySQL Docker Image:** [https://hub.docker.com/_/mysql](https://hub.docker.com/_/mysql)  
* **Google Application Passwords:** [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) 
* **Picsum Photos (Random Placeholder Images):** [https://picsum.photos/](https://picsum.photos/) 
* **Unsplash (High-Quality Stock Photos):** [https://images.unsplash.com/](https://images.unsplash.com/)

---

## 📧 Contact

*   [Đàm Nguyễn Trọng Lễ] - [trongle250504@gmail.com] - (GitHub: [**headtomatoes** ĐÀM NGUYỄN TRỌNG LỄ](https://github.com/headtomatoes))
*   [Nguyễn Quốc Trung] - (GitHub: [**qtrung123**](https://github.com/qtrung123))
*   [Lê Nhật Anh] - (GitHub: [**anhle2008**](https://github.com/anhle2008))
*   [Lê Hưng] - (GitHub: [**hungCS22hcmiu** Lê Hưng](https://github.com/hungCS22hcmiu))
