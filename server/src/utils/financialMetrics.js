const calculateCAGR = (initialValue, finalValue, years) => {
    if (years <= 0) return 0;
    return ((finalValue / initialValue) ** (1 / years) - 1) * 100;
};

const calculateRevenueGrowth = (revenueData) => {
    if (!Array.isArray(revenueData) || revenueData.length < 2) return 0;
    const initialRevenue = revenueData[0];
    const finalRevenue = revenueData[revenueData.length - 1];
    return ((finalRevenue - initialRevenue) / initialRevenue) * 100;
};

const calculateAverageRevenue = (revenueData) => {
    if (!Array.isArray(revenueData) || revenueData.length === 0) return 0;
    const totalRevenue = revenueData.reduce((acc, curr) => acc + curr, 0);
    return totalRevenue / revenueData.length;
};

module.exports = {
    calculateCAGR,
    calculateRevenueGrowth,
    calculateAverageRevenue,
};