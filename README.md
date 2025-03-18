# eBay Clone - Auction & E-Commerce Platform (template - modify later)

## Project Overview
This project is an eBay-inspired auction and e-commerce web application developed as a course project. The platform allows users to list items, place bids, participate in auctions, and make direct purchases.

## Core Features
- User authentication and profile management
- Product listing and search functionality
- Real-time auction system with bidding
- Secure payment processing
- User ratings and reviews
- Admin dashboard for platform management

## Technology Stack

### Frontend
- **Framework**: React.js
- **UI Library**: Material-UI (or Tailwind/Bootstrap)
- **State Management**: Context API
- **Testing**: Jest for component testing

### Backend
- **Framework**: Spring Boot
- **API Design**: RESTful API
- **Authentication**: JWT tokens
- **Security**: Spring Security with BCrypt password hashing
- **Real-time Communication**: WebSockets

### Database
- **DBMS**: MySQL
- **ORM**: Spring Data JPA
- **Migration Tool**: Liquibase (optional)

### Testing
- **Frontend**: Jest
- **Backend**: JUnit
- **API Testing**: Insomnia

### Version Control
- **System**: Git
- **Platform**: GitHub

## Project Structure

```
ebay-clone/
├── frontend/                # React frontend application
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context for state management
│   │   ├── services/        # API service integration
│   │   └── utils/           # Utility functions
│   └── tests/               # Frontend tests
├── backend/                 # Spring Boot backend application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/        # Java source code
│   │   │   │   ├── controllers/  # REST controllers
│   │   │   │   ├── models/       # Entity classes
│   │   │   │   ├── repositories/ # JPA repositories
│   │   │   │   ├── services/     # Business logic
│   │   │   │   ├── security/     # Security configuration
│   │   │   │   └── websocket/    # WebSocket handlers
│   │   │   └── resources/   # Application properties and static resources
│   │   └── test/            # Backend tests
├── docs/                    # Documentation
└── README.md                # This file
```

## Getting Started

### Prerequisites
- Node.js and npm (v14+ recommended)
- Java JDK 11+
- MySQL Server
- Git

### Installation and Setup

#### Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

#### Backend
```bash
# Navigate to backend directory
cd backend

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

#### Database
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE ebay_clone;
```

Update `application.properties` with your database credentials.

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
- [Member 1] - Frontend Developer
- [Member 2] - Backend Developer
- [Member 3] - Full-stack Developer (Security Focus)
- [Member 4] - DevOps & Integration Specialist

## Project Timeline
- Week 1: Core features and authentication
- Week 2: Auction mechanism and transaction processing
- Week 3: UI polish and additional features
- Week 4: Testing and bug fixes

## Learning Resources

### Frontend
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Material-UI Documentation](https://mui.com/getting-started/usage/)

### Backend
- [Spring Boot Guides](https://spring.io/guides)
- [Baeldung Spring Boot Tutorials](https://www.baeldung.com/spring-boot)

### Full Learning Resource List
See our [Learning Resources Document](./docs/learning-resources.md) for a comprehensive list of free learning materials for all technologies used in this project.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
