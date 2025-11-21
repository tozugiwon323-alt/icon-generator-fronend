import { useState } from 'react';
import ImageGrid from './ImageGrid';
import LoadingSpinner from './LoadingSpinner';
import { validatePrompt, validateColors, sanitizePrompt } from '../utils/validation';
import { generateIcons } from '../apis';

const STYLE_PRESETS = [
  { value: 'auto', label: 'Auto' },
  { value: 'bold', label: 'Bold' },
  { value: 'circular', label: 'Circular' },
  { value: 'flat-colors', label: 'Flat Colors' },
  { value: 'monotone', label: 'Monotone' },
  { value: 'outline', label: 'Outline' }
];

function IconGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('auto');
  const [colors, setColors] = useState(['']);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const addColorInput = () => {
    setColors([...colors, '']);
  };

  const removeColorInput = (index) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors.length > 0 ? newColors : ['']);
  };

  const updateColor = (index, value) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const validateHexColor = (color) => {
    if (!color) return true; // Empty is okay
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    // Validate prompt
    const promptValidation = validatePrompt(prompt);
    if (!promptValidation.valid) {
      setError(promptValidation.error);
      return;
    }

    // Validate colors
    const colorsValidation = validateColors(colors);
    if (!colorsValidation.valid) {
      setError(colorsValidation.error);
      return;
    }

    const sanitizedPrompt = sanitizePrompt(prompt);
    const validColors = colors.filter(c => c.trim() !== '');

    setLoading(true);
    setError(null);
    setImages([]);

    try {
      const result = await generateIcons({ prompt: sanitizedPrompt, style, colors: validColors });

      if (result.success) {
        setImages(result.images);
        setMetadata(result.metadata);
      } else {
        setError('Failed to generate icons');
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            Icon Set Generator
          </h1>
          <p className="text-xl text-purple-100">
            Generate 4 consistent icons from a single prompt
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <form onSubmit={handleGenerate}>
            {/* Prompt Input */}
            <div className="mb-6">
              <label htmlFor="prompt" className="block text-lg font-semibold text-gray-800 mb-2">
                Prompt for Icon Set
              </label>
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Hockey equipment, Office supplies, Weather icons..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-800 text-lg"
                disabled={loading}
              />
            </div>

            {/* Style Preset */}
            <div className="mb-6">
              <label htmlFor="style" className="block text-lg font-semibold text-gray-800 mb-2">
                Preset Style
              </label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-800 text-lg cursor-pointer"
                disabled={loading}
              >
                {STYLE_PRESETS.map(preset => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Inputs */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Brand Colors (Optional)
              </label>
              <div className="space-y-3">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      placeholder="#FF5733"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-800"
                      disabled={loading}
                    />
                    {color && validateHexColor(color) && (
                      <div
                        className="w-12 h-10 rounded-lg border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    )}
                    {colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColorInput(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {colors.length < 5 && (
                <button
                  type="button"
                  onClick={addColorInput}
                  className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={loading}
                >
                  + Add Color
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${loading || !prompt.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                } text-white`}
            >
              {loading ? 'Generating Icons...' : 'Generate Icon Set'}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Results */}
        {images.length > 0 && !loading && (
          <ImageGrid images={images} metadata={metadata} />
        )}
      </div>
    </div>
  );
}

export default IconGenerator;

