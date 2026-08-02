import express from "express";
import cors from "cors";
import db from "./database.js";

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER NOT NULL,
    title TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list TEXT NOT NULL,
    title TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )
`);
// db.exec("DELETE FROM lists");
// db.exec("DELETE FROM sqlite_sequence WHERE name = 'lists';");

db.exec(`
  INSERT OR IGNORE INTO lists (name) VALUES ('Nákup');
  INSERT OR IGNORE INTO lists (name) VALUES ('Lednice');
  INSERT OR IGNORE INTO lists (name) VALUES ('Skříň');
  
  `);

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    // "https://shopping-list-gamma-one.vercel.app",
  ],
};

app.use(cors(corsOptions));

app.get("/lists", (req, res) => {
  const statement = db.prepare(`
    SELECT * FROM lists `);

  const lists = statement.all();
  res.json(lists);
});

app.post("/lists", (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({
      error: "Name is required",
    });
  }
  const statement = db.prepare(`

    INSERT INTO lists ( name)
    VALUES (?)
    
    `);
  const result = statement.run(name);
  res.json({
    id: result.lastInsertRowid,
    name: name,
  });
});

app.get("/lists/:listId", (req, res) => {
  const { listId } = req.params;

  const statement = db.prepare(`
    SELECT *
    FROM lists
    WHERE id = ?
  `);

  const list = statement.get(listId);

  res.json(list);
});

app.get("/lists/:listId/items", (req, res) => {
  const { listId } = req.params;

  console.log("listId:", listId);

  const statement = db.prepare(`
  SELECT * FROM items
  WHERE list_id = ?
  `);
  const items = statement.all(listId);
  res.json(items);
});

app.post("/lists/:listId/items", (req, res) => {
  const { listId } = req.params;
  const { title } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({
      error: "Title is required",
    });
  }
  const statement = db.prepare(`
    INSERT INTO items (list_id, title)
    VALUES (?, ?)
    
    `);
  const result = statement.run(listId, title);
  res.json({
    id: result.lastInsertRowid,
    list_id: listId,
    title: title,
  });
});

app.delete("/items/:id", (req, res) => {
  const { id } = req.params;
  const statement = db.prepare(`
    DELETE FROM items
    WHERE id = ? 
  `);
  const result = statement.run(id);
  res.json({
    message: "Položka smazána",
  });
});

app.put("/items/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({
      error: "Title is required",
    });
  } else {
    const statement = db.prepare(`
      UPDATE items
      SET title = ?
      WHERE id = ? `);
    const result = statement.run(title, id);
    res.json({
      message: "Příspěvek upraven",
    });
  }
});

// app.put("/posts/:list/:id", (req, res) => {
//   const { list, id } = req.params;
//   const { title } = req.body;

//   const statement = db.prepare(`
//     UPDATE posts
//     SET title = ?
//     WHERE id = ? AND list = ?
//   `);
// app.delete("/posts/:list/:id", (req, res) => {
//   const { list, id } = req.params;

//   const statement = db.prepare(`
//     DELETE FROM posts
//     WHERE id = ? AND list = ?
//   `);

//   const result = statement.run(id, list);

//   res.json({
//     message: "Položka smazána",
//   });
// });

// app.post(`/lists`, (req, res) => {
//   const { name } = req.body;
//   if (!name?.trim()) {
//     return res.status(400).json({
//       error: "Name is required",
//     });
//   }
//   const statement = db.prepare(`

//     INSERT INTO lists (name)
//     VALUES (?)`);
//   const result = statement.run(name);
//   res.json({
//     id: result.lastInsertRowid,
//     name,
//   });
// });

// app.get("/lists/:id", (req, res) => {
//   const { id } = req.params;
//   const statement = db.prepare(`
// SELECT * FROM lists WHERE id = ?`);

//   const lists = statement.get(id);
//   res.json(lists);
// });

// const items = statement.all(listId);

// console.log(items);

// res.json(items);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//   const result = statement.run(title, id, list);

//   res.json({
//     message: "Příspěvek upraven",
//   });
// });

// app.post("/posts/:list", (req, res) => {
//   const { list } = req.params;
//   const { title } = req.body;

//   const statement = db.prepare(`
//     INSERT INTO posts (list, title)
//     VALUES (?, ?)
//   `);

//   const result = statement.run(list, title);

//   res.status(201).json({
//     message: "Příspěvek vytvořen",
//     id: result.lastInsertRowid,
//     list: list,
//     title: title,
//   });
// });

// app.patch("/posts/:id/move", (req, res) => {
//   const { id } = req.params;
//   const { newList } = req.body;

//   const statement = db.prepare(`
//     UPDATE posts
//     SET list = ?
//     WHERE id = ?
//   `);

//   statement.run(newList, id);

//   res.json({
//     message: "Položka přesunuta",
//   });
// });
