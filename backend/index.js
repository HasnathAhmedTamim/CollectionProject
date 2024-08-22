const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config(); // Load environment variables from .env file
const bcrypt = require("bcrypt"); // For password hashing

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Error adding user." });
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const userCollection = client.db("collectionprojectdb").collection("users");
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Send a response indicating successful login
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in." });
  }
});

// Add a comment to an item
app.post("/items/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { author, text } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const itemCollection = client.db("collectionprojectdb").collection("items");
    const item = await itemCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    const comment = {
      author,
      text,
      createdAt: new Date(),
    };

    await itemCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { comments: comment } }
    );

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment." });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await client.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
});

connectToDB().then(() => {
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
