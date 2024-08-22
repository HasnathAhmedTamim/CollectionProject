import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ItemDetails = () => {
  const { id } = useParams(); // Get the item ID from the URL parameters
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/items/${id}`); // Fetch item details from the backend
        const data = await response.json();
        setItem(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching item details:", error);
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (!item) {
    return <p>Item not found.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">{item.name}</h2>
      <p className="text-gray-700 mb-2">Collection: {item.collection}</p>
      <p className="text-gray-700 mb-2">Author: {item.author}</p>
      <p className="text-gray-700 mb-2">Description: {item.description}</p>
      <p className="text-gray-700 mb-2">
        Tags: {item.tags ? item.tags.join(", ") : "No tags"}
      </p>
      <p className="text-gray-700 mb-2">
        Created at: {new Date(item.createdAt).toLocaleDateString()}
      </p>

      {/* Display images or a message if no images are found */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Images</h3>
        {item.images && item.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {item.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-auto border border-gray-300 rounded-lg shadow-md"
              />
            ))}
          </div>
        ) : (
          <p>No images available for this item.</p>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
