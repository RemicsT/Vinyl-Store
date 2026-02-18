const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// CONNECT TO MYSQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",   // PUT YOUR MYSQL PASSWORD HERE
  database: "vinyl_store_db"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:");
    console.error(err);
    return;
  }
  console.log("✅ Connected to MySQL");
});
// ================= CRUD =================

// READ
app.get("/records", (req, res) => {
  db.query("SELECT * FROM records", (err, result) => {
    if (err) {
      console.error("QUERY ERROR:");
      console.error(err);
      return res.status(500).json(err);
    }
    console.log("Records fetched successfully");
    res.json(result);
  });
});


// CREATE
app.post("/records", (req, res) => {
  const { title, release_year, price, stock, artist_id, genre_id, supplier_id } = req.body;

  const sql = `
    INSERT INTO records
    (title, release_year, price, stock, artist_id, genre_id, supplier_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, release_year, price, stock, artist_id, genre_id, supplier_id],
    (err, result) => {
      if (err) res.status(500).json(err);
      res.json({ message: "Record added successfully" });
  });
});

// UPDATE
app.put("/records/:id", (req, res) => {
  const { title, price, stock } = req.body;

  db.query(
    "UPDATE records SET title=?, price=?, stock=? WHERE record_id=?",
    [title, price, stock, req.params.id],
    (err, result) => {
      if (err) res.status(500).json(err);
      res.json({ message: "Record updated successfully" });
    }
  );
});

// DELETE
app.delete("/records/:id", (req, res) => {
  db.query(
    "DELETE FROM records WHERE record_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: "Record deleted successfully" });
    }
  );
});

// START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

