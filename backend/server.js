import express from "express";
import cors from "cors";
import db from "./database.js";

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list TEXT NOT NULL,
    title TEXT NOT NULL
  )
`);

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://shopping-list-gamma-one.vercel.app",
  ],
};

app.use(cors(corsOptions));
app.get("/posts/:list", (req, res) => {
  const { list } = req.params;

  const statement = db.prepare(`
    SELECT * FROM posts
    WHERE list = ?
  `);

  const posts = statement.all(list);

  res.json(posts);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use(express.json());

app.put("/posts/:list/:id", (req, res) => {
  const { list, id } = req.params;
  const { title } = req.body;

  const statement = db.prepare(`
    UPDATE posts
    SET title = ?
    WHERE id = ? AND list = ?
  `);

  const result = statement.run(title, id, list);

  res.json({
    message: "Příspěvek upraven",
  });
});

app.post("/posts/:list", (req, res) => {
  const { list } = req.params;
  const { title } = req.body;

  const statement = db.prepare(`
    INSERT INTO posts (list, title)
    VALUES (?, ?)
  `);

  const result = statement.run(list, title);

  res.status(201).json({
    message: "Příspěvek vytvořen",
    id: result.lastInsertRowid,
    list: list,
    title: title,
  });
});

app.delete("/posts/:list/:id", (req, res) => {
  const { list, id } = req.params;

  const statement = db.prepare(`
    DELETE FROM posts
    WHERE id = ? AND list = ?
  `);

  const result = statement.run(id, list);

  res.json({
    message: "Položka smazána",
  });
});

app.patch("/posts/:id/move", (req, res) => {
  const { id } = req.params;
  const { newList } = req.body;

  const statement = db.prepare(`
    UPDATE posts
    SET list = ?
    WHERE id = ?
  `);

  statement.run(newList, id);

  res.json({
    message: "Položka přesunuta",
  });
});
