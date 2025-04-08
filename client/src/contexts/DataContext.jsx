import React, { createContext, useState, useEffect } from 'react';
import { fetchFinancialData } from '../utils/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [financialData, setFinancialData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFinancialData = async () => {
            try {
                const data = await fetchFinancialData();
                setFinancialData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadFinancialData();
    }, []);

    return (
        <DataContext.Provider value={{ financialData, loading, error }}>
            {children}
        </DataContext.Provider>
    );
};