import { useState } from 'react';

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create a preview URL for the image
      setImageDetails({
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`, // Convert size to KB
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-3">Welcome to Dynamic App</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block mb-4"
        />
        {image && (
          <div className="mt-4">
            <img
              src={image}
              alt="Uploaded Preview"
              className="w-64 h-64 object-cover rounded-lg shadow-md"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Image Details:</h3>
              <p>
                <strong>Name:</strong> {imageDetails.name}
              </p>
              <p>
                <strong>Type:</strong> {imageDetails.type}
              </p>
              <p>
                <strong>Size:</strong> {imageDetails.size}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
