"use client";
import { useState, useEffect, useCallback } from "react";
import StatisticsBox from "./components/StatisticsBox";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import LoadingSpinner from "./components/LoadingSpinner";

const API_BASE_URL = "http://localhost:5000/api";

export default function Home() {
    console.log('Page component starting...');
    const [selectedMonth, setSelectedMonth] = useState('03');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        transactions: { data: [], pagination: { total: 0, hasNextPage: false } },
        statistics: null,
        barData: [],
        pieData: []
    });
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Handle search without debounce for immediate response
    const handleSearch = (query) => {
        console.log('Search query:', query);
        setSearchQuery(query);
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (isInitialLoad) {
                setLoading(true);
            }
            
            try {
                console.log('Attempting to fetch data with search:', searchQuery);
                
                // Fetch transactions with search and pagination
                const transactionsResponse = await fetch(
                    `${API_BASE_URL}/transactions?month=${selectedMonth}&page=${currentPage}&search=${searchQuery}`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                if (!transactionsResponse.ok) {
                    throw new Error(`API Error: ${transactionsResponse.status}`);
                }

                // Fetch statistics
                const statisticsResponse = await fetch(
                    `${API_BASE_URL}/statistics?month=${selectedMonth}`
                );
                
                if (!statisticsResponse.ok) {
                    throw new Error(`Statistics API Error: ${statisticsResponse.status}`);
                }

                // Fetch bar chart data
                const barChartResponse = await fetch(
                    `${API_BASE_URL}/barchart?month=${selectedMonth}`
                );
                
                if (!barChartResponse.ok) {
                    throw new Error(`Bar Chart API Error: ${barChartResponse.status}`);
                }

                // Fetch pie chart data
                const pieChartResponse = await fetch(
                    `${API_BASE_URL}/piechart?month=${selectedMonth}`
                );
                
                if (!pieChartResponse.ok) {
                    throw new Error(`Pie Chart API Error: ${pieChartResponse.status}`);
                }

                const [transactionsData, statisticsData, barChartData, pieChartData] = await Promise.all([
                    transactionsResponse.json(),
                    statisticsResponse.json(),
                    barChartResponse.json(),
                    pieChartResponse.json()
                ]);
                
                console.log('Data received:', { transactionsData, statisticsData, barChartData, pieChartData });
                
                setData({
                    transactions: {
                        data: transactionsData.transactions || [],
                        pagination: {
                            total: transactionsData.pagination?.total || 0,
                            hasNextPage: transactionsData.pagination?.total_pages > currentPage
                        }
                    },
                    statistics: statisticsData,
                    barData: barChartData || [],
                    pieData: pieChartData || []
                });
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
                setIsInitialLoad(false);
            }
        };

        fetchData();
    }, [selectedMonth, currentPage, searchQuery]); // Added searchQuery to dependencies

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        setCurrentPage(1);
        setIsInitialLoad(true);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading transactions...</p>
                    <p className="mt-2 text-sm text-gray-500">Connecting to API...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Connection Error</h3>
                            <p className="mt-2 text-sm text-gray-500">{error}</p>
                            <div className="mt-4 space-y-2">
                                <p className="text-sm text-gray-600">Please check:</p>
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                    <li>Backend server is running on port 5000</li>
                                    <li>CORS is properly configured on the backend</li>
                                    <li>Network connection is stable</li>
                                </ul>
                                <button 
                                    onClick={() => {
                                        setLoading(true);
                                        setError(null);
                                    }}
                                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
            {/* Background blur circles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Transaction Dashboard
                            </h1>
                            <p className="mt-1 text-gray-400">
                                Monitor your transaction analytics
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="order-2 sm:order-1 w-full sm:w-64 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                            <select
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                className="order-1 sm:order-2 w-full sm:w-auto bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl px-4 py-2 appearance-none hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                                style={{ 
                                    WebkitAppearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='white' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                <option value="01" className="bg-[#1a1a1a] text-white">January</option>
                                <option value="02" className="bg-[#1a1a1a] text-white">February</option>
                                <option value="03" className="bg-[#1a1a1a] text-white">March</option>
                                <option value="04" className="bg-[#1a1a1a] text-white">April</option>
                                <option value="05" className="bg-[#1a1a1a] text-white">May</option>
                                <option value="06" className="bg-[#1a1a1a] text-white">June</option>
                                <option value="07" className="bg-[#1a1a1a] text-white">July</option>
                                <option value="08" className="bg-[#1a1a1a] text-white">August</option>
                                <option value="09" className="bg-[#1a1a1a] text-white">September</option>
                                <option value="10" className="bg-[#1a1a1a] text-white">October</option>
                                <option value="11" className="bg-[#1a1a1a] text-white">November</option>
                                <option value="12" className="bg-[#1a1a1a] text-white">December</option>
                            </select>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="space-y-8">
                    {/* Statistics */}
                    <section>
                        <StatisticsBox stats={data.statistics} />
                    </section>

                    {/* Charts */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">
                                Price Range Distribution
                            </h2>
                            <div className="aspect-[4/3] sm:aspect-[16/9]">
                                <BarChart data={data.barData} loading={loading} />
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">
                                Items by Category
                            </h2>
                            <div className="aspect-[4/3] sm:aspect-[16/9]">
                                <PieChart data={data.pieData} loading={loading} />
                            </div>
                        </div>
                    </section>

                    {/* Transactions */}
                    <section className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-white">
                                    Transaction List
                                </h2>
                                <div className="relative w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search transactions..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl pl-10 pr-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="overflow-hidden shadow-sm ring-1 ring-black/5 rounded-2xl bg-white">
                                    {isInitialLoad ? (
                                        <div className="flex items-center justify-center h-64">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                                        </div>
                                    ) : data.transactions.data.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-64">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <p className="mt-4 text-gray-500">No transactions found</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {data.transactions.data.map((transaction) => (
                                                <div 
                                                    key={transaction._id || transaction.id}
                                                    className="group hover:bg-gray-50 transition-all duration-200"
                                                >
                                                    <div className="px-6 py-4">
                                                        <div className="flex items-start space-x-4">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1">
                                                                        <h3 className="text-base font-medium text-gray-900 truncate pr-4">
                                                                            {transaction.title}
                                                                        </h3>
                                                                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                                            {transaction.description}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex-shrink-0 flex flex-col items-end space-y-2">
                                                                        <span className="text-lg font-semibold text-gray-900">
                                                                            ${typeof transaction.price === 'number' ? transaction.price.toFixed(2) : transaction.price}
                                                                        </span>
                                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                                            transaction.sold 
                                                                                ? 'bg-green-100 text-green-800' 
                                                                                : 'bg-yellow-100 text-yellow-800'
                                                                        }`}>
                                                                            {transaction.sold ? 'Sold' : 'Available'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-2 flex items-center gap-4 text-sm">
                                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100/10 border border-purple-500/20 text-purple-400">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                                        </svg>
                                                                        <span className="font-medium">{transaction.category}</span>
                                                                    </span>
                                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100/10 border border-blue-500/20 text-blue-400">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        <span className="font-medium">ID: {transaction._id || transaction.id}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={!data.transactions.pagination.hasNextPage}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">
                                            Showing page <span className="font-medium">{currentPage}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-4 py-2 rounded-l-lg text-sm font-medium text-white bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Previous</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={!data.transactions.pagination.hasNextPage}
                                                className="relative inline-flex items-center px-4 py-2 rounded-r-lg text-sm font-medium text-white bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Next</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
