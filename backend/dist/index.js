"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const client_1 = require("./database/client");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./database/schema");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: "https://library-management-git-main-srinithi-as-projects.vercel.app",
    credentials: true
}));
app.use(express_1.default.json());
app.post("/books", async (req, res) => {
    const { title, author, price, userId } = req.body;
    if (!title || !author || typeof price !== "number" || !userId) {
        res.status(400).json({ message: "Missing fields" });
    }
    const id = (0, uuid_1.v4)();
    try {
        await client_1.db.insert(schema_1.books).values({ id, title, author, price, userId });
        const book = await client_1.db.query.books.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.books.id, id) });
        res.status(201).json({ message: "Book created", book });
    }
    catch (err) {
        console.error("Error creating book:", err);
        res.status(500).json({ message: "Error creating book", error: err });
    }
});
app.get("/users", async (req, res) => {
    try {
        const allUsers = await client_1.db.select().from(schema_1.users);
        res.json(allUsers);
    }
    catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users" });
    }
});
app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ message: "Name and Email are required" });
    }
    try {
        // Check if user already exists
        const existing = await client_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
        });
        if (existing) {
            res.status(400).json({ message: "User already exists" });
        }
        // Create new user
        const id = (0, uuid_1.v4)();
        await client_1.db.insert(schema_1.users).values({ id, name, email });
        const newUser = await client_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, id),
        });
        res.status(201).json({ message: "User created", user: newUser });
    }
    catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Error creating user", error: err });
    }
});
app.listen(port, () => {
    console.log(`API running on port ${port}`);
});
