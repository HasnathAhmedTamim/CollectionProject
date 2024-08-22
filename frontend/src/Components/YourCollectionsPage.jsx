import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const YourCollectionsPage = () => {
  const { user } = useContext(AuthContext);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCollections = async () => {
      if (!user) return;

      try {
        // Fetch collections for the logged-in user
        const response = await fetch(
          `http://localhost:5000/collections?userId=${user.uid}`
        );
        const data = await response.json();
        setCollections(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user collections:", error);
        setLoading(false);
      }
    };

    fetchUserCollections();
  }, [user]);

  if (loading) {
    return <p>Loading your collections...</p>;
  }

  if (!collections.length) {
    return <p>You have no collections yet.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Your Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Link
            to={`/collections/${collection._id}`}
            key={collection._id}
            className="p-4 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
            <p className="text-gray-700 mb-2">Size: {collection.size}</p>
            <p className="text-gray-700 mb-2">
              Description: {collection.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default YourCollectionsPage;
