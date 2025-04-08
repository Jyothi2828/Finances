# Financial Statistics Application

## Overview
The Financial Statistics Application is a full-stack web application that allows authenticated users to view and analyze financial statistics and visualizations. The application utilizes MongoDB for data storage and Chart.js for data visualization, providing users with insights into key financial metrics such as revenue over time and Compound Annual Growth Rate (CAGR).

## Features
- User authentication (login and registration)
- Secure access to financial statistics and visualizations
- Storage of financial data including revenue and CAGR
- Advanced search functionality for businesses based on financial metrics
- Interactive charts and visualizations using Chart.js

## Technologies Used
- **Frontend**: React, Chart.js
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Project Structure
```
financial-statistics-app
├── client                # Frontend application
│   ├── public            # Public assets
│   ├── src               # Source files for React application
│   └── README.md         # Client documentation
├── server                # Backend application
│   ├── src               # Source files for Node.js application
│   └── README.md         # Server documentation
├── .gitignore            # Git ignore file
└── README.md             # Overall project documentation
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the server directory and install dependencies:
   ```
   cd financial-statistics-app/server
   npm install
   ```

3. Navigate to the client directory and install dependencies:
   ```
   cd ../client
   npm install
   ```

### Running the Application

1. Start the MongoDB server.

2. Start the backend server:
   ```
   cd financial-statistics-app/server
   npm start
   ```

3. Start the frontend application:
   ```
   cd financial-statistics-app/client
   npm start
   ```

### API Documentation
Refer to the server's README.md for detailed API endpoints and usage.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.