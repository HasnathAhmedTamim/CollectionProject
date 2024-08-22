import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PublicCollectionsPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/items"); // Fetch items from your backend API
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Explore Public Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <Link
              to={`/items/${item._id}`} // Link to the item's details page
              key={item._id}
              className="p-4 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-700 mb-2">
                Collection: {item.collection}
              </p>
              <p className="text-gray-700 mb-2">Author: {item.author}</p>
              <p className="text-gray-700 mb-2">
                Tags:{" "}
                {Array.isArray(item.tags) ? item.tags.join(", ") : "No tags"}
              </p>
              <p className="text-gray-700 mb-2">
                Created at: {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))
        ) : (
          <p>No items to display.</p>
        )}
      </div>
    </div>
  );
};

export default PublicCollectionsPage;
