const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config(); // Load environment variables from .env file
const bcrypt = require("bcrypt"); // For password hashing
const multer = require("multer"); // For handling file uploads
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve static files from the "public" directory

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Directory where uploaded files will be saved
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext; // Unique filename
    cb(null, filename);
  },
});
const upload = multer({ storage });

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o8mpxcb.mongodb.net/collectionprojectdb?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB
async function connectToDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
}

// Define routes

// Root route
app.get("/", (req, res) => {
  res.send("Hello Collection Worlds!");
});

// Get all items
app.get("/items", async (req, res) => {
  try {
    const itemCollection = client.db("collectionprojectdb").collection("items");
    const result = await itemCollection.find().toArray();
    res.json(result);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items." });
  }
});

// Get an item by ID
app.get("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const itemCollection = client.db("collectionprojectdb").collection("items");
    const item = await itemCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Error fetching item." });
  }
});

// Get comments for a specific item
app.get("/items/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const itemCollection = client.db("collectionprojectdb").collection("items");
    const item = await itemCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.json(item.comments || []);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments." });
  }
});

// Get all collections
app.get("/collections", async (req, res) => {
  try {
    const collectionCollection = client
      .db("collectionprojectdb")
      .collection("collections");
    const result = await collectionCollection.find().toArray();
    res.json(result);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ message: "Error fetching collections." });
  }
});

// Get a collection by ID
app.get("/collections/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const collectionCollection = client
      .db("collectionprojectdb")
      .collection("collections");
    const collection = await collectionCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    res.json(collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ message: "Error fetching collection." });
  }
});
// Add an item to a collection
app.post("/collections/:collectionId/items", upload.single("image"), async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { name, description, tags } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!ObjectId.isValid(collectionId)) {
      return res.status(400).json({ message: "Invalid collection ID format." });
    }

    // Validate input
    if (!name || !description) {
      return res.status(400).json({
        message: "Missing required fields: name or description.",
      });
    }

    // Create the item object
    const newItem = {
      name,
      description,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      image,
    };

    // Update the collection with the new item
    const result = await client
      .db("collectionprojectdb")
      .collection("collections")
      .updateOne(
        { _id: new ObjectId(collectionId) },
        { $push: { items: newItem } }
      );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Collection not found or item not added." });
    }

    res.status(201).json({ message: "Item added successfully." });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Error adding item." });
  }
});


// Create a new collection
app.post("/collections", upload.single("image"), async (req, res) => {
  try {
    const { name, description, tags, author, createdAt } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validate input
    if (!name || !description || !author || !createdAt) {
      return res.status(400).json({
        message:
          "Missing required fields: name, description, author, or createdAt.",
      });
    }

    // Create the collection object
    const newCollection = {
      name,
      description,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      author,
      createdAt: new Date(createdAt),
      image,
    };

    // Insert the new collection into the database
    const result = await client
      .db("collectionprojectdb")
      .collection("collections")
      .insertOne(newCollection);

    // Send a response with the inserted collection ID
    res.status(201).json({ ...newCollection, id: result.insertedId });
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ message: "Error creating collection." });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const userCollection = client.db("collectionprojectdb").collection("users");
    const result = await userCollection.find().toArray();
    res.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users." });
  }
});

// Get a user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const userCollection = client.db("collectionprojectdb").collection("users");
    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user." });
  }
});

// Add a new user
app.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Simple validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields: username, email, or password.",
      });
    }

    // Ensure the email is unique
    const existingUser = await client
      .db("collectionprojectdb")
      .collection("users")
      .findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user object
    const newUser = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    // Insert the new user into the database
    const result = await client
      .db("collectionprojectdb")
      .collection("users")
      .insertOne(newUser);

    // Send a response with the inserted user ID
    res.status(201).json({ ...newUser, id: result.insertedId });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user." });
  }
});

// Start server and connect to DB
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToDB();
});
