"use client";

const LoadingSpinner = () => {
    console.log('Rendering LoadingSpinner');
    console.log('Debug log: LoadingSpinner component is being rendered');
    return (
        <div className="flex justify-center items-center h-screen bg-[#171923]">
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-400 border-t-gray-200 rounded-full animate-[spin_1s_ease-in-out_infinite]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-200 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>
                <p className="mt-4 text-gray-200 text-lg font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
