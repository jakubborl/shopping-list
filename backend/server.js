import express from "express";
import cors from "cors";
import db from "./database.js";

// db.exec(`
//   CREATE TABLE IF NOT EXISTS items (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     list_id INTEGER NOT NULL,
//     title TEXT NOT NULL,
//     completed INTEGER NOT NULL DEFAULT 0

//   )
// `);

// const columns = db.prepare(`PRAGMA table_info(items)`).all();

// const hasCompleted = columns.some((column) => column.name === "completed");

// if (!hasCompleted) {
//   db.exec(`
//     ALTER TABLE items
//     ADD COLUMN completed INTEGER NOT NULL DEFAULT 0
//   `);
// }

// db.exec(`
//   CREATE TABLE IF NOT EXISTS posts (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     list TEXT NOT NULL,
//     title TEXT NOT NULL
//   )
// `);

// db.exec(`
//   CREATE TABLE IF NOT EXISTS lists (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL UNIQUE
//   )
// `);
// // db.exec("DELETE FROM lists");
// // db.exec("DELETE FROM sqlite_sequence WHERE name = 'lists';");

// db.exec(`
//   INSERT OR IGNORE INTO lists (name) VALUES ('Nákup');
//   INSERT OR IGNORE INTO lists (name) VALUES ('Lednice');
//   INSERT OR IGNORE INTO lists (name) VALUES ('Skříň');

//   `);

const app = express();

async function initDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS lists (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      favorite INTEGER NOT NULL DEFAULT 0
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      list_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0
    )
  `);
}

initDatabase();

app.use(express.json());
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: ["https://shopping-list-gamma-one.vercel.app"],
  // origin: ["https://shopping-list-gamma-one.vercel.app"],
};

app.use(cors(corsOptions));

app.get("/lists", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM lists
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.get("/lists/:listId", async (req, res) => {
  try {
    const { listId } = req.params;

    const result = await db.query(
      `
        SELECT *
        FROM lists
        WHERE id = $1
      `,
      [listId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.get("/lists/:listId/items", async (req, res) => {
  try {
    const { listId } = req.params;

    console.log("listId:", listId);

    const result = await db.query(
      `
        SELECT *
        FROM items
        WHERE list_id = $1
        ORDER BY id DESC
      `,
      [listId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.post("/lists", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        error: "Name is required",
      });
    }

    const result = await db.query(
      `
        INSERT INTO lists (name)
        VALUES ($1)
        RETURNING id
      `,
      [name]
    );

    res.json({
      id: result.rows[0].id,
      name: name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.delete("/lists/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "List-id is required",
      });
    }

    console.log("Mažu seznam:", id);

    await db.query(
      `
        DELETE FROM items
        WHERE list_id = $1
      `,
      [id]
    );

    await db.query(
      `
        DELETE FROM lists
        WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: "Seznam smazán",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.put("/lists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        error: "name is required",
      });
    }

    await db.query(
      `
        UPDATE lists
        SET name = $1
        WHERE id = $2
      `,
      [name, id]
    );

    res.json({
      message: "Název seznamu upraven",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.post("/lists/:listId/items", async (req, res) => {
  try {
    const { listId } = req.params;
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const result = await db.query(
      `
        INSERT INTO items (list_id, title)
        VALUES ($1, $2)
        RETURNING id, list_id, title, completed
      `,
      [listId, title]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
        DELETE FROM items
        WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: "Položka smazána",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    await db.query(
      `
        UPDATE items
        SET title = $1
        WHERE id = $2
      `,
      [title, id]
    );

    res.json({
      message: "Položka upravena",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.patch("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        error: "completed must be boolean",
      });
    }

    await db.query(
      `
        UPDATE items
        SET completed = $1
        WHERE id = $2
      `,
      [completed ? 1 : 0, id]
    );

    res.json({
      message: "Completed upraven",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
