import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";
import { db } from "./database/client";
import { eq } from "drizzle-orm";
import {users, books } from "./database/schema";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

type BookRequestBody = {
  title: string;
  author: string;
  price: number;
  userId: string;
};

app.post("/books", async (req: Request<{}, {}, BookRequestBody>, res: Response) => {
  const { title, author, price, userId } = req.body;

  if (!title || !author || typeof price !== "number" || !userId) {
    res.status(400).json({ message: "Missing fields" });
  }

  const id = uuidV4();

  try {
    await db.insert(books).values({ id, title, author, price, userId });
    const book = await db.query.books.findFirst({ where: eq(books.id, id) });
    res.status(201).json({ message: "Book created", book });
  } catch (err) {
    console.error("Error creating book:", err);
    res.status(500).json({ message: "Error creating book", error: err });
  }
});
app.get("/users", async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
     res.status(400).json({ message: "Name and Email are required" });
  }

  try {
    // Check if user already exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existing) {
      res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const id = uuidV4();
    await db.insert(users).values({ id, name, email });

    const newUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user", error: err });
  }
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
