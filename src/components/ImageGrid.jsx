import { useState } from 'react';

function ImageGrid({ images, metadata }) {
  const [downloadingIndex, setDownloadingIndex] = useState(null);

  const downloadImage = async (imageUrl, index) => {
    setDownloadingIndex(index);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `icon-${metadata?.prompt?.replace(/\s+/g, '-')}-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image');
    } finally {
      setDownloadingIndex(null);
    }
  };

  const downloadAll = async () => {
    for (let i = 0; i < images.length; i++) {
      await downloadImage(images[i], i);
      // Add delay between downloads
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      {/* Metadata */}
      <div className="mb-6 pb-6 border-b-2 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Generated Icon Set
        </h2>
        {metadata && (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-purple-100 px-4 py-2 rounded-lg">
              <span className="font-semibold text-purple-900">Prompt:</span>
              <span className="ml-2 text-purple-700">{metadata.prompt}</span>
            </div>
            <div className="bg-pink-100 px-4 py-2 rounded-lg">
              <span className="font-semibold text-pink-900">Style:</span>
              <span className="ml-2 text-pink-700">{metadata.style}</span>
            </div>
            {metadata.colors && metadata.colors.length > 0 && (
              <div className="bg-blue-100 px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="font-semibold text-blue-900">Colors:</span>
                {metadata.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Download All Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={downloadAll}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
        >
          Download All Icons
        </button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="relative group bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border-2 border-gray-200"
          >
            {/* Image */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={imageUrl}
                alt={`Icon ${index + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
              <button
                onClick={() => downloadImage(imageUrl, index)}
                disabled={downloadingIndex === index}
                className="opacity-0 group-hover:opacity-100 transition-opacity px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100"
              >
                {downloadingIndex === index ? 'Downloading...' : 'Download PNG'}
              </button>
            </div>

            {/* Index Label */}
            <div className="absolute top-3 left-3 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-bold text-gray-700">
              Icon {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGrid;

