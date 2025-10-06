import express from "express";
import { createServer } from "http";
import { storage } from "./storage.js";
import { insertUserSchema, insertTaskSchema } from "@shared/schema";
import { startViteServer } from "./vite.js";
import open from "open";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Authentication routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await storage.getUserByUsername(username);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const result = insertUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }

    const existingUser = await storage.getUserByUsername(result.data.username);

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = await storage.createUser(result.data);

    res.json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Task routes
app.get("/api/tasks", async (req, res) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const tasks = await storage.getTasks(userId);
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const result = insertTaskSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }

    const task = await storage.createTask(result.data);
    res.json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await storage.updateTask(id, req.body);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

async function startServer() {
  await startViteServer(app);

  const server = createServer(app);

  server.listen(port, async () => {
    const url = `http://localhost:${port}`;
    console.log(`🚀 Dev server running at ${url}`);
    console.log(`🌐 Opening browser...`);
    await open(url);
  });
}

startServer();
