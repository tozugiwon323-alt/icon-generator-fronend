function LoadingSpinner() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-12">
      <div className="flex flex-col items-center justify-center">
        {/* Spinner */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-purple-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Generating Your Icons
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          Creating 4 consistent icons with your specified style. This may take a minute...
        </p>
        
        {/* Progress Indicator */}
        <div className="mt-6 flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;

