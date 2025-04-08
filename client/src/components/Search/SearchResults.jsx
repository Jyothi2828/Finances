import React from 'react';

const SearchResults = ({ results }) => {
    return (
        <div>
            <h2>Search Results</h2>
            {results.length === 0 ? (
                <p>No results found.</p>
            ) : (
                <ul>
                    {results.map((result, index) => (
                        <li key={index}>
                            <h3>{result.businessName}</h3>
                            <p>Revenue: ${result.revenue}</p>
                            <p>CAGR: {result.cagr}%</p>
                            <p>Other Metrics: {JSON.stringify(result.otherMetrics)}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchResults;