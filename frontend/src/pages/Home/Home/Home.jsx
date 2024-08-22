import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [latestItems, setLatestItems] = useState([]);
  const [topCollections, setTopCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, collectionsResponse] = await Promise.all([
          fetch("http://localhost:5000/items"),
          fetch("http://localhost:5000/collections"),
        ]);

        if (!itemsResponse.ok)
          throw new Error(`Items fetch failed: ${itemsResponse.statusText}`);
        if (!collectionsResponse.ok)
          throw new Error(
            `Collections fetch failed: ${collectionsResponse.statusText}`
          );

        const itemsData = await itemsResponse.json();
        const collectionsData = await collectionsResponse.json();

        setLatestItems(itemsData.slice(0, 6));
        setTopCollections(
          collectionsData.sort((a, b) => b.size - a.size).slice(0, 5)
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold">Welcome to My Collection</h1>
        <p className="text-lg text-gray-700 mt-2">
          Manage and explore your personal collections easily.
        </p>
        {user && (
          <p className="text-lg text-gray-700 mt-4">
            Hello, {user.displayName || "User"}! What would you like to do
            today?
          </p>
        )}
      </header>

      {/* Key Features */}
      <div className="flex flex-col md:flex-row md:justify-around space-y-4 md:space-y-0">
        <Link
          to="/create-collection"
          className="bg-blue-500 text-white p-4 rounded-lg shadow-md text-center hover:bg-blue-600"
          aria-label="Create a new collection"
        >
          Create New Collection
        </Link>
        <Link
          to="/collections"
          className="bg-green-500 text-white p-4 rounded-lg shadow-md text-center hover:bg-green-600"
          aria-label="View your collections"
        >
          View Your Collections
        </Link>
        <Link
          to="/public-collections"
          className="bg-purple-500 text-white p-4 rounded-lg shadow-md text-center hover:bg-purple-600"
          aria-label="Explore public collections"
        >
          Explore Public Collections
        </Link>
      </div>

      {/* Search Functionality */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Search Collections</h2>
        <input
          type="text"
          placeholder="Search collections..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <p className="text-center mt-8">Loading data...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-8">{error}</p>
      ) : (
        <>
          {/* Latest Items */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Latest Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestItems.length > 0 ? (
                latestItems.map((item) => (
                  <Link
                    to={`/items/${item._id}`} // Assuming you have a route for item details
                    key={item._id}
                    className="p-4 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100"
                  >
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-700 mb-2">
                      Collection: {item.collection}
                    </p>
                    <p className="text-gray-700 mb-2">Author: {item.author}</p>
                    <p className="text-gray-700 mb-2">
                      Tags:{" "}
                      {Array.isArray(item.tags)
                        ? item.tags.join(", ")
                        : "No tags"}
                    </p>
                    <p className="text-gray-700 mb-2">
                      Created at:{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-2">
                      Updated at:{" "}
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))
              ) : (
                <p>No items to display.</p>
              )}
            </div>
          </div>

          {/* Top 5 Largest Collections */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Top 5 Largest Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCollections.length > 0 ? (
                topCollections.map((collection) => (
                  <Link
                    to={`/collections/${collection._id}`}
                    key={collection._id}
                    className="p-4 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {collection.name}
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Description: {collection.description}
                    </p>
                    <p className="text-gray-700 mb-2">
                      Number of Items: {collection.size}
                    </p>
                    <p className="text-gray-700 mb-2">
                      Tags:{" "}
                      {Array.isArray(collection.tags)
                        ? collection.tags.join(", ")
                        : "No tags"}
                    </p>
                    <p className="text-gray-700 mb-2">
                      Created at:{" "}
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-2">
                      Updated at:{" "}
                      {new Date(collection.updatedAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))
              ) : (
                <p>No collections to display.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
