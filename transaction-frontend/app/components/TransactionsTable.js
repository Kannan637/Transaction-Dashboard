"use client";
import { useState, useEffect } from 'react';

const TransactionsTable = ({ data, searchTerm, onSearch, currentPage, onPageChange }) => {
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(debouncedSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [debouncedSearch, onSearch]);

    const handleSearch = (e) => {
        setDebouncedSearch(e.target.value);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-xs">
                    <input
                        type="text"
                        value={debouncedSearch || ""}
                        onChange={handleSearch}
                        placeholder="Search transactions..."
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 
                                 focus:ring-purple-500/50 focus:border-transparent transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="rounded-xl bg-gradient-to-b from-white/10 to-white/5 p-0.5">
                <div className="overflow-x-auto rounded-xl bg-gray-900/50 backdrop-blur-xl">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-medium text-white/60">ID</span>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-medium text-white/60">Title</span>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-medium text-white/60">Price</span>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-medium text-white/60">Description</span>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-medium text-white/60">Category</span>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-medium text-white/60">Status</span>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-medium text-white/60">Date</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {!data?.data || data.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center">
                                        <span className="text-white/50">No transactions found</span>
                                    </td>
                                </tr>
                            ) : (
                                data.data.map((transaction) => (
                                    <tr 
                                        key={transaction._id}
                                        className="group transition-all duration-200 hover:bg-white/5"
                                    >
                                        <td className="px-4 py-3">
                                            <span className="text-xs text-white/70 group-hover:text-white transition-colors">
                                                {transaction._id.slice(-6)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-white/90 truncate group-hover:text-white transition-colors max-w-[150px]">
                                                {transaction.title}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-medium text-white/90 group-hover:text-white transition-colors">
                                                ${transaction.price.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-white/70 truncate group-hover:text-white transition-colors max-w-[200px]">
                                                {transaction.description}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                transaction.sold
                                                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                            }`}>
                                                {transaction.sold ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs text-white/70 group-hover:text-white transition-colors">
                                                {new Date(transaction.dateOfSale).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-4 py-3 sm:px-6 rounded-lg">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white/70 
                                 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!data?.pagination?.hasNextPage}
                        className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium 
                                 text-white/70 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-white/50">
                            Showing <span className="font-medium text-white/70">{data?.data?.length || 0}</span> results
                            {data?.pagination?.total && (
                                <> of <span className="font-medium text-white/70">{data.pagination.total}</span></>
                            )}
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-white/10 
                                         bg-white/5 text-sm font-medium text-white/70 hover:bg-white/10 
                                         disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={!data?.pagination?.hasNextPage}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-white/10 
                                         bg-white/5 text-sm font-medium text-white/70 hover:bg-white/10 
                                         disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionsTable;
