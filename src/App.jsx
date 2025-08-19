import { useState } from 'react';
import './index.css';

const API_URL = "https://ai-image-classifier-backend-93uw.onrender.com";

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        setPrediction(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get a prediction from the server.');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Error:", error);
      setPrediction({ class_name: "Error", confidence: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center border border-gray-700 transform transition-transform duration-500 hover:scale-105">
        <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">AI Image Classifier</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
          <label className="w-full">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105">
              Select an Image
            </span>
          </label>
          
          <button
            type="submit"
            disabled={isLoading || !file}
            className="w-full max-w-xs bg-gray-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Predicting...' : 'Predict'}
          </button>
        </form>

        {previewUrl && (
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">Image Preview</h2>
            <img src={previewUrl} alt="Preview" className="mx-auto rounded-xl shadow-lg max-w-full h-auto border border-gray-600" />
          </div>
        )}

        {prediction && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">Prediction</h2>
            <p className="text-lg font-medium">Class: <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 capitalize">{prediction.class_name}</span></p>
            <p className="text-lg font-medium">Confidence: <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{(prediction.confidence * 100).toFixed(2)}%</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;