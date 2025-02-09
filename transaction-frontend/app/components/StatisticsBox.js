"use client";

const StatisticsBox = ({ stats }) => {
    if (!stats) return null;

    const items = [
        {
            title: "Total Sale Amount",
            value: `$${stats.totalSaleAmount?.toFixed(2) || '0.00'}`,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            gradient: "from-emerald-400/20 to-teal-400/20"
        },
        {
            title: "Total Sold Items",
            value: stats.soldItems || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
            ),
            gradient: "from-blue-400/20 to-indigo-400/20"
        },
        {
            title: "Total Not Sold Items",
            value: stats.notSoldItems || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
            gradient: "from-rose-400/20 to-pink-400/20"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="relative group"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl ${item.gradient}`}></div>
                    <div className="relative bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 transition-transform duration-300 hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-300">{item.title}</p>
                                <p className="mt-2 text-3xl font-bold text-white tracking-tight">{item.value}</p>
                            </div>
                            <div className="text-white/70">{item.icon}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatisticsBox;
