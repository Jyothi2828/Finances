import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { fetchFinancialData } from '../utils/api';

const useFinancialData = () => {
    const { setFinancialData } = useContext(DataContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFinancialData = async () => {
            try {
                const data = await fetchFinancialData();
                setFinancialData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getFinancialData();
    }, [setFinancialData]);

    return { loading, error };
};

export default useFinancialData;