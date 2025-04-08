# Financial Statistics Application

This project is a full-stack application that allows authenticated users to view financial statistics and visualizations. It utilizes MongoDB as the backend database and Chart.js for data visualization.

## Client

The client is built using React and provides a user-friendly interface for interacting with financial data. Key features include:

- **Authentication**: Users can register and log in to access financial statistics.
- **Dashboard**: A main dashboard that displays various financial metrics and visualizations.
- **Charts**: Visual representations of financial data, including revenue over time and Compound Annual Growth Rate (CAGR).
- **Advanced Search**: Functionality to search for businesses based on financial metrics.

### Project Structure

```
client
├── public
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── assets
│   ├── components
│   │   ├── Authentication
│   │   ├── Dashboard
│   │   ├── Charts
│   │   └── Search
│   ├── contexts
│   ├── hooks
│   ├── utils
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the client directory:
   ```
   cd financial-statistics-app/client
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the client application, run:
```
npm start
```

This will launch the application in your default web browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.