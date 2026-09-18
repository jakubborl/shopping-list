import express from "express";
import cors from "cors";
import db from "./database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  await db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );`);

  const columns = await db.query(`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_name = 'lists'
`);

  const itemColumns = await db.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'items'
`);

  const hasUserId = itemColumns.rows.some(
    (column) => column.column_name === "user_id"
  );

  if (!hasUserId) {
    await db.query(`
    ALTER TABLE items
    ADD COLUMN user_id INTEGER
  `);
  }
}

initDatabase();

app.use(express.json());
const port = process.env.PORT || 8080;

const corsOptions = {
  // origin: ["http://localhost:5173"],
  origin: ["https://shopping-list-gamma-one.vercel.app"],
};

app.use(cors(corsOptions));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(403).json({
      error: "Invalid or expired token",
    });
  }
};

app.get("/lists", authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `
        SELECT *
        FROM lists
        WHERE user_id = $1
      `,
      [req.userId]
    );

    console.log("USER ID:", req.userId);
    console.log("LISTS:", result.rows);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.get("/lists/:listId", authenticateToken, async (req, res) => {
  try {
    const { listId } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM lists
      WHERE id = $1 AND user_id = $2
      `,
      [listId, req.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.get("/lists/:listId/items", authenticateToken, async (req, res) => {
  try {
    const { listId } = req.params;

    console.log("listId:", listId);

    const result = await db.query(
      `
        SELECT *
        FROM items
        WHERE list_id = $1
        AND user_id = $2
        ORDER BY id DESC
      `,
      [listId, req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.post("/lists", authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        error: "Name is required",
      });
    }

    const result = await db.query(
      `
        INSERT INTO lists (name, user_id)
        VALUES ($1, $2)
        RETURNING id, name, favorite, user_id
      `,
      [name.trim(), req.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.delete("/lists/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
        DELETE FROM items
        WHERE list_id = $1 AND user_id = $2
      `,
      [id, req.userId]
    );

    const result = await db.query(
      `
        DELETE FROM lists
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Seznam nenalezen",
      });
    }

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

app.put("/lists/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        error: "name is required",
      });
    }

    const result = await db.query(
      `
        UPDATE lists
        SET name = $1
        WHERE id = $2 AND user_id = $3
      `,
      [name, id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Seznam nenalezen",
      });
    }

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

app.post("/lists/:listId/items", authenticateToken, async (req, res) => {
  try {
    const { listId } = req.params;
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const list = await db.query(
      `
        SELECT id
        FROM lists
        WHERE id = $1 AND user_id = $2
      `,
      [listId, req.userId]
    );
    if (list.rows.length === 0) {
      return res.status(404).json({
        error: "Seznam nenalezen",
      });
    }

    const result = await db.query(
      `
        INSERT INTO items (list_id, title, user_id)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [listId, title.trim(), req.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.delete("/items/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
        DELETE FROM items
        WHERE id = $1 AND user_id = $2
      `,
      [id, req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Položka nenalezena",
      });
    }

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

app.put("/items/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const result = await db.query(
      `
        UPDATE items
        SET title = $1
        WHERE id = $2 AND user_id = $3
      `,
      [title, id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Položka nenalezena",
      });
    }

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

app.patch("/items/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        error: "completed must be boolean",
      });
    }

    const result = await db.query(
      `
        UPDATE items
        SET completed = $1
        WHERE id = $2 AND user_id = $3
      `,
      [completed ? 1 : 0, id, req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Položka nenalezena",
      });
    }

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

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email
      `,
      [email.trim(), passwordHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const result = await db.query(
      `
        SELECT *
        FROM users
        WHERE email = $1
      `,
      [email.trim()]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Přihlášení úspěšné",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Chyba databáze",
    });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: "Email a heslo jsou povinné",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email
      `,
      [email.trim(), hashedPassword]
    );

    res.status(201).json({
      message: "Registrace úspěšná",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Tento email už je registrovaný",
      });
    }

    res.status(500).json({
      error: "Chyba při registraci",
    });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
