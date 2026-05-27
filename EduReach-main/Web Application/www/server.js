const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 5000;

// Prometheus metrics setup
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000]
});

app.use(cors());
app.use(express.json());

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.path, res.statusCode)
      .observe(duration);
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Initialize SQLite Database
const dbPath = path.resolve(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) {
          console.error("Error creating table " + err.message);
        }
      }
    );
  }
});

app.get("/", (req, res) => {
  res.send("EduSphere Server Running 🚀");
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",

      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",   // ✅ FIXED
        messages: [
          {
            role: "system",
            content: "You are EduSphere AI assistant. Help students with coding, exams and projects."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    console.log(data);

    const botReply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "AI se reply nahi aaya 😢";

    res.json({ reply: botReply });

  } catch (error) {
    console.error(error);
    res.json({ reply: "Server error ❌" });
  }
});

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Please provide name, email, and password." });
  }

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.run(sql, [name, email, password], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ success: false, message: "Email already exists." });
      }
      return res.status(500).json({ success: false, message: "Database error." });
    }
    res.json({ success: true, message: "Registration successful!" });
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please provide email and password." });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.get(sql, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error." });
    }
    if (!row) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }
    res.json({ success: true, message: "Login successful!", user: { id: row.id, name: row.name, email: row.email } });
  });
});

app.get("/api/users", (req, res) => {
  const sql = "SELECT id, name, email, created_at FROM users ORDER BY created_at DESC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error." });
    }
    res.json({ success: true, users: rows });
  });
});

app.post("/api/teacher-login", (req, res) => {
  const { uid, password } = req.body;
  
  // Hardcoded check for presentation
  if (uid === "admin" && password === "password") {
    return res.json({ success: true, message: "Teacher login successful!" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid Teacher UID or password." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
