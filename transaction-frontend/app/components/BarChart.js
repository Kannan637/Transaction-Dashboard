"use client";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/30"></div>
            </div>
        );
    }

    const chartData = {
        labels: data.map(item => item.range),
        datasets: [
            {
                label: 'Number of Items',
                data: data.map(item => item.count),
                backgroundColor: 'rgba(147, 51, 234, 0.5)',
                borderColor: 'rgba(147, 51, 234, 0.8)',
                borderWidth: 1,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(147, 51, 234, 0.7)',
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                titleColor: 'rgba(255, 255, 255, 0.9)',
                bodyColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 14,
                    weight: '500'
                },
                bodyFont: {
                    size: 13
                },
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `Items: ${context.raw}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 11
                    },
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="w-full h-full">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default BarChart;
