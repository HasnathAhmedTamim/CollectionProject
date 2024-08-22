// src/components/CollectionDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CollectionDetails = () => {
  const { id } = useParams(); // Get the collection ID from the URL
  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      try {
        // Fetch the collection details by ID
        const collectionResponse = await fetch(
          `http://localhost:5000/collections/${id}`
        );
        const collectionData = await collectionResponse.json();
        setCollection(collectionData);

        // Fetch the items belonging to this collection
        const itemsResponse = await fetch(
          `http://localhost:5000/items?collectionId=${id}`
        );
        const itemsData = await itemsResponse.json();
        setItems(itemsData);
      } catch (error) {
        console.error("Error fetching collection details:", error);
      }
    };

    fetchCollectionDetails();
  }, [id]);

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Collection Details */}
      <h1 className="text-3xl font-bold mb-4">{collection.name}</h1>
      <p className="text-gray-700 mb-4">{collection.description}</p>
      <p className="text-gray-700 mb-4">
        Created by: {collection.author || "Unknown"}
      </p>
      <p className="text-gray-700 mb-4">Number of items: {collection.size}</p>

      {/* Items in the Collection */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Items in this Collection</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="p-4 border border-gray-300 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-700 mb-2">Author: {item.author}</p>
                <p className="text-gray-700 mb-2">
                  Description: {item.description}
                </p>
                <p className="text-gray-700 mb-2">
                  Tags: {item.tags.join(", ")}
                </p>
                <p className="text-gray-700 mb-2">
                  Created at: {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-2">
                  Updated at: {new Date(item.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No items found in this collection.</p>
        )}
      </div>
    </div>
  );
};

export default CollectionDetails;
