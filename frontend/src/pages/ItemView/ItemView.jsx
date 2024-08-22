import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ItemView = () => {
  const { id } = useParams(); // Get the item ID from the URL
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`http://localhost:5000/items/${id}`);
        const data = await response.json();
        setItem(data);
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    const fetchComments = () => {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/items/${id}/comments`
          );
          const data = await response.json();
          setComments(data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      }, 5000); // Fetch comments every 5 seconds

      return () => clearInterval(interval);
    };

    fetchItem();
    fetchComments();
  }, [id]);

  return (
    <div className="container mx-auto p-6">
      {item ? (
        <div>
          <h1 className="text-4xl font-bold">{item.name}</h1>
          <p className="text-lg">{item.description}</p>
          <div>
            <h2 className="text-2xl font-bold mt-6">Comments</h2>
            <ul>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <li
                    key={comment._id}
                    className="border-b border-gray-300 py-2"
                  >
                    <p className="font-semibold">{comment.author}</p>
                    <p>{comment.text}</p>
                  </li>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ItemView;
