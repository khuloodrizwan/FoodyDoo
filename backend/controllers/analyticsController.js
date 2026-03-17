import orderModel from "../models/orderModel.js";

const getAnalytics = async (req, res) => {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // Annual orders - is saal ke sab orders
        const annualOrders = await orderModel.find({
            date: {
                $gte: new Date(currentYear, 0, 1),
                $lte: new Date(currentYear, 11, 31)
            }
        });

        // Monthly orders - is month ke orders
        const monthlyOrders = await orderModel.find({
            date: {
                $gte: new Date(currentYear, currentMonth, 1),
                $lte: new Date(currentYear, currentMonth + 1, 0)
            }
        });

        // Annual revenue - sab paid orders ka total
        const annualRevenue = annualOrders
            .filter(order => order.payment === true)
            .reduce((sum, order) => sum + order.amount, 0);

        // Monthly revenue
        const monthlyRevenue = monthlyOrders
            .filter(order => order.payment === true)
            .reduce((sum, order) => sum + order.amount, 0);

        // Har month ka data chart ke liye
        const monthlyData = [];
        for (let i = 0; i < 12; i++) {
            const monthOrders = annualOrders.filter(order => {
                const orderMonth = new Date(order.date).getMonth();
                return orderMonth === i;
            });
            const monthRevenue = monthOrders
                .filter(order => order.payment === true)
                .reduce((sum, order) => sum + order.amount, 0);

            monthlyData.push({
                month: new Date(currentYear, i, 1).toLocaleString('default', { month: 'short' }),
                orders: monthOrders.length,
                revenue: monthRevenue
            });
        }

        res.json({
            success: true,
            data: {
                annualOrders: annualOrders.length,
                monthlyOrders: monthlyOrders.length,
                annualRevenue,
                monthlyRevenue,
                monthlyData
            }
        })

    } catch (error) {
        res.json({ success: false, message: "Error fetching analytics" })
    }
}

export { getAnalytics }