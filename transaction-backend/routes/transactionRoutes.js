const express = require("express");
const axios = require("axios");
const Transaction = require("../models/Transaction");
const router = express.Router();
const API_URL = process.env.API_URL || "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

// Helper function to get date range for a month
const getDateRangeForMonth = (month) => {
    month = parseInt(month);
    if (isNaN(month) || month < 1 || month > 12) {
        throw new Error("Invalid month");
    }
    return {
        $expr: {
            $eq: [{ $month: "$dateOfSale" }, month]
        }
    };
};

// 1. API to fetch and store transactions from external API
router.get("/seed", async (req, res) => {
    try {
        const { data } = await axios.get(API_URL);
        await Transaction.deleteMany(); // Clear old data
        
        // Ensure all dates are properly formatted
        const formattedData = data.map(item => ({
            ...item,
            dateOfSale: new Date(item.dateOfSale)
        }));
        
        await Transaction.insertMany(formattedData);
        res.json({ message: "Database seeded successfully" });
    } catch (error) {
        console.error("Seeding Error:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// 2. Enhanced Transactions API with search and pagination
router.get("/transactions", async (req, res) => {
    try {
        let { month, search, page = 1, per_page = 10 } = req.query;
        if (!month) return res.status(400).json({ error: "Month is required" });

        // Build query
        const query = getDateRangeForMonth(month);

        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: isNaN(search) ? undefined : Number(search) }
            ].filter(Boolean);
        }

        // Convert page and per_page to numbers
        page = parseInt(page);
        per_page = parseInt(per_page);

        // Get total count for pagination
        const total = await Transaction.countDocuments(query);
        
        // Fetch paginated results
        const transactions = await Transaction.find(query)
            .skip((page - 1) * per_page)
            .limit(per_page);

        res.json({
            transactions,
            pagination: {
                total,
                page,
                per_page,
                total_pages: Math.ceil(total / per_page)
            }
        });
    } catch (error) {
        console.error("Transaction Fetch Error:", error);
        res.status(500).json({ error: "Error fetching transactions" });
    }
});

// 3. Statistics API
router.get("/statistics", async (req, res) => {
    try {
        const { month } = req.query;
        if (!month) return res.status(400).json({ error: "Month is required" });

        const query = getDateRangeForMonth(month);

        const statistics = await Transaction.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalSaleAmount: { $sum: "$price" },
                    soldItems: { $sum: { $cond: ["$sold", 1, 0] } },
                    notSoldItems: { $sum: { $cond: ["$sold", 0, 1] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalSaleAmount: { $round: ["$totalSaleAmount", 2] },
                    soldItems: 1,
                    notSoldItems: 1
                }
            }
        ]);

        res.json(statistics[0] || { totalSaleAmount: 0, soldItems: 0, notSoldItems: 0 });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ error: "Error fetching statistics" });
    }
});

// 4. Bar Chart API
router.get("/barchart", async (req, res) => {
    try {
        const { month } = req.query;
        if (!month) return res.status(400).json({ error: "Month is required" });

        const query = getDateRangeForMonth(month);

        const priceRanges = [
            { range: "0-100", min: 0, max: 100 },
            { range: "101-200", min: 101, max: 200 },
            { range: "201-300", min: 201, max: 300 },
            { range: "301-400", min: 301, max: 400 },
            { range: "401-500", min: 401, max: 500 },
            { range: "501-600", min: 501, max: 600 },
            { range: "601-700", min: 601, max: 700 },
            { range: "701-800", min: 701, max: 800 },
            { range: "801-900", min: 801, max: 900 },
            { range: "901+", min: 901, max: Number.MAX_SAFE_INTEGER }
        ];

        const barData = await Promise.all(
            priceRanges.map(async ({ range, min, max }) => {
                const rangeQuery = {
                    ...query,
                    price: { $gte: min, ...(max !== Number.MAX_SAFE_INTEGER ? { $lte: max } : {}) }
                };
                const count = await Transaction.countDocuments(rangeQuery);
                return { range, count };
            })
        );

        res.json(barData);
    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        res.status(500).json({ error: "Error fetching bar chart data" });
    }
});

// 5. Pie Chart API
router.get("/piechart", async (req, res) => {
    try {
        const { month } = req.query;
        if (!month) return res.status(400).json({ error: "Month is required" });

        const query = getDateRangeForMonth(month);

        const pieChartData = await Transaction.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    count: 1
                }
            }
        ]);

        res.json(pieChartData);
    } catch (error) {
        console.error("Error fetching pie chart data:", error);
        res.status(500).json({ error: "Error fetching pie chart data" });
    }
});

// 6. Combined Data API
router.get("/combined-data", async (req, res) => {
    try {
        const { month } = req.query;
        if (!month) return res.status(400).json({ error: "Month is required" });

        const query = getDateRangeForMonth(month);

        // Fetch all data directly from MongoDB instead of making HTTP requests
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            Transaction.find(query).limit(10),
            Transaction.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: null,
                        totalSaleAmount: { $sum: "$price" },
                        soldItems: { $sum: { $cond: ["$sold", 1, 0] } },
                        notSoldItems: { $sum: { $cond: ["$sold", 0, 1] } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalSaleAmount: { $round: ["$totalSaleAmount", 2] },
                        soldItems: 1,
                        notSoldItems: 1
                    }
                }
            ]).then(results => results[0] || { totalSaleAmount: 0, soldItems: 0, notSoldItems: 0 }),
            Promise.all(
                [
                    { range: "0-100", min: 0, max: 100 },
                    { range: "101-200", min: 101, max: 200 },
                    { range: "201-300", min: 201, max: 300 },
                    { range: "301-400", min: 301, max: 400 },
                    { range: "401-500", min: 401, max: 500 },
                    { range: "501-600", min: 501, max: 600 },
                    { range: "601-700", min: 601, max: 700 },
                    { range: "701-800", min: 701, max: 800 },
                    { range: "801-900", min: 801, max: 900 },
                    { range: "901+", min: 901, max: Number.MAX_SAFE_INTEGER }
                ].map(async ({ range, min, max }) => {
                    const rangeQuery = {
                        ...query,
                        price: { $gte: min, ...(max !== Number.MAX_SAFE_INTEGER ? { $lte: max } : {}) }
                    };
                    const count = await Transaction.countDocuments(rangeQuery);
                    return { range, count };
                })
            ),
            Transaction.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: "$category",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: "$_id",
                        count: 1
                    }
                }
            ])
        ]);

        res.json({
            transactions,
            statistics,
            barChart,
            pieChart
        });
    } catch (error) {
        console.error("Error fetching combined data:", error);
        res.status(500).json({ error: "Error fetching combined data" });
    }
});

module.exports = router;
