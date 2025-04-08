import React from 'react';
import RevenueChart from './RevenueChart';
import CAGRChart from './CAGRChart';

const ChartContainer = () => {
    return (
        <div>
            <h2>Financial Statistics</h2>
            <RevenueChart />
            <CAGRChart />
        </div>
    );
};

export default ChartContainer;