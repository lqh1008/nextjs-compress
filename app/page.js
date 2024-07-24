"use client"

import { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('format', 'webp');
    formData.append('quality', '70');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setCompressedImage(data.imagePath);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Compression App</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded">Upload and Compress</button>
      {compressedImage && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Compressed Image:</h2>
          <img src={compressedImage} alt="Compressed" className="mt-2" />
        </div>
      )}
    </div>
  );
}
