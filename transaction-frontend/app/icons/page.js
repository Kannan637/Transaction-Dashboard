"use client";

const IconGenerator = () => {
  const iconSizes = [
    { size: 32, name: 'icon.png' },
    { size: 192, name: 'icon-192.png' },
    { size: 512, name: 'icon-512.png' },
    { size: 180, name: 'apple-icon.png' },
  ];

  const generateIcon = (size) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#171923';
    ctx.fillRect(0, 0, size, size);

    // Lightning bolt
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const scale = size / 24;
    ctx.beginPath();
    ctx.moveTo(13 * scale, 10 * scale);
    ctx.lineTo(13 * scale, 3 * scale);
    ctx.lineTo(4 * scale, 14 * scale);
    ctx.lineTo(11 * scale, 14 * scale);
    ctx.lineTo(11 * scale, 21 * scale);
    ctx.lineTo(20 * scale, 10 * scale);
    ctx.lineTo(13 * scale, 10 * scale);
    ctx.stroke();

    return canvas.toDataURL('image/png');
  };

  const downloadIcon = (size, name) => {
    const dataUrl = generateIcon(size);
    const link = document.createElement('a');
    link.download = name;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#171923] text-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Icon Generator</h1>
        <div className="space-y-4">
          {iconSizes.map(({ size, name }) => (
            <div key={name} className="flex items-center justify-between bg-[#1f2733] p-4 rounded-lg">
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-400">{size}x{size}px</p>
              </div>
              <button
                onClick={() => downloadIcon(size, name)}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Generate & Download
              </button>
            </div>
          ))}
          <div className="mt-8 text-sm text-gray-400">
            <p>After downloading all icons:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Move them to the public directory</li>
              <li>Convert icon.png to favicon.ico using a converter</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconGenerator;
