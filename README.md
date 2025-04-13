# eBay Clone - Auction & E-Commerce Platform (template - modify later)

## Project Overview
This project is an eBay-inspired auction and e-commerce web application developed as a course project. The platform allows users to list items, place bids, participate in auctions, and make direct purchases.

**Core MVP Features:**

1. User Registration & Login (JWT Auth)
2. Sellers can list Products (Direct Buy or Auction)
3. Users can browse/search Products
4. Users can view Product Details
5. Users can place Bids on Auctions (Real-time updates)
6. Users can directly buy "Direct Buy" items
7. Basic indication of won/purchased items (no full checkout/payment processing)
8. (Stretch Goal) Basic Feedback system after a transaction.

**Technology Reminder:**

- **Frontend:** React, Context API, Tailwind CSS
- **Backend:** Spring Boot, Spring Security (JWT, BCrypt), REST API, WebSockets, JPA
- **Database:** MySQL (using the schema we defined earlier)
- **Testing:** Jest, JUnit, Postman
- **Version Control:** Git/GitHub

## Project Structure (to be modified)

```
ebay-clone-project/
├── .gitignore          
├── README.md           
├── backend/            
└── frontend/           
    
```

## Getting Started

### Prerequisites
- Node.js and npm (v14+ recommended)
- Maven (for Java backend)
- Java JDK 21+
- MySQL Server
- Git
- Postman (for API testing)
- Docker (optional, for containerization)
- IntelliJ IDEA (for Java development)
- Visual Studio Code (for JavaScript development)


## Development Workflow

1. **Branch Strategy**
   - `main`: Production-ready code
   - `develop`: Integration branch
   - Feature branches: `feature/feature-name`
   - Bug fixes: `fix/bug-description`

2. **Pull Request Process**
   - Create feature branch from `develop`
   - Develop and test your feature
   - Create a pull request to `develop`
   - Code review by at least one team member
   - Merge after approval

3. **Coding Standards**
   - Frontend: ESLint, Prettier configuration
   - Backend: Google Java Style Guide

## Team Organization

### Team Members
- [Nguyễn Quốc Trung] - Frontend Developer
- [Lê Hưng] - Backend Developer (Database focus)
- [Đàm Nguyễn Trọng Lễ] - Full-stack Developer (WebSocket focus)
- [Lê Nhật Anh] - Backend Developer (Security focus)

## License
This project is licensed under the MIT License - see the LICENSE file for details.
