import { useState } from "react";
import Swal from "sweetalert2";

function AddItemToCollection({ collectionId }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await fetch(
        `http://localhost:5000/collections/${collectionId}/items`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const result = await response.json();
      Swal.fire("Success!", "Item added successfully.", "success");
    } catch (error) {
      console.error("Error adding item:", error);
      Swal.fire("Error!", "Failed to add item.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Item Name"
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma separated)"
        onChange={handleChange}
      />
      <input type="file" name="image" onChange={handleChange} />
      <button type="submit">Add Item</button>
    </form>
  );
}

export default AddItemToCollection;
