"use client";
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const COLORS = [
    'rgba(54, 162, 235, 0.8)',   // Blue
    'rgba(75, 192, 192, 0.8)',   // Teal
    'rgba(255, 99, 132, 0.8)',   // Pink
    'rgba(255, 206, 86, 0.8)',   // Yellow
    'rgba(153, 102, 255, 0.8)',  // Purple
    'rgba(255, 159, 64, 0.8)',   // Orange
    'rgba(76, 175, 80, 0.8)',    // Green
    'rgba(244, 67, 54, 0.8)',    // Red
    'rgba(156, 39, 176, 0.8)',   // Deep Purple
    'rgba(121, 85, 72, 0.8)'     // Brown
];

const PieChart = ({ data, loading }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
            }
        },
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 12,
                        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'rgba(255, 255, 255, 1)',
                bodyColor: 'rgba(255, 255, 255, 1)',
                padding: 12,
                cornerRadius: 4,
                callbacks: {
                    label: function(context) {
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return ` ${context.label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    const chartData = {
        labels: data?.map(item => item.category) || [],
        datasets: [{
            data: data?.map(item => item.count) || [],
            backgroundColor: COLORS,
            borderColor: COLORS.map(color => color.replace('0.8', '1')),
            borderWidth: 1,
            hoverOffset: 4
        }]
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <div className="animate-pulse text-white/50">Loading chart data...</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <div className="text-white/50">No data available</div>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px]">
            <h2 className="text-xl font-bold mb-4 text-center text-white">Category Distribution</h2>
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default PieChart;
