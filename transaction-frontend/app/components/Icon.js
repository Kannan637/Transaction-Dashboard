import Image from 'next/image';

const Icon = ({ size = 512 }) => {
  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        background: '#171923',
        padding: size * 0.1,
        borderRadius: size * 0.1
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M13 10V3L4 14h7v7l9-11h-7z" 
            fill="none" 
            stroke="#E2E8F0" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default Icon;
