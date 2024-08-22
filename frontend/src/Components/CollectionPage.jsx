// src/components/CollectionsPage.jsx
import React, { useState, useEffect } from "react";

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("http://localhost:5000/collections");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.length > 0 ? (
          collections.map((collection) => (
            <div
              key={collection._id}
              className="p-4 border border-gray-300 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold mb-2">{collection.name}</h2>
              <p className="text-gray-700 mb-2">Size: {collection.size}</p>
              <p className="text-gray-700">
                Description: {collection.description}
              </p>
              {/* Link to a detailed view or related items */}
              <a
                href={`/collections/${collection._id}`}
                className="text-blue-500 hover:underline"
              >
                View Collection
              </a>
            </div>
          ))
        ) : (
          <p>No collections available.</p>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
