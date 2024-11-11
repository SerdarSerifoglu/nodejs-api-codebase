const express = require("express");
const fs = require("fs");
var cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors());

// JSON dosyasını okuyan yardımcı fonksiyon
const readUsersFromFile = () => {
  const data = fs.readFileSync("users.json");
  return JSON.parse(data);
};

// JSON dosyasına yazan yardımcı fonksiyon
const writeUsersToFile = (data) => {
  fs.writeFileSync("users.json", JSON.stringify(data, null, 2));
};

// Get all users
app.get("/users", (req, res) => {
  const users = readUsersFromFile();
  setTimeout(() => {
    res.json(users);
  }, 2000);
});

// Get a user by ID
app.get("/users/:id", (req, res) => {
  const users = readUsersFromFile();
  const user = users.find((u) => u.id === parseInt(req.params.id));
  setTimeout(() => {
    if (user) res.json(user);
    else res.status(404).send("User not found");
  }, 2000);
});

// Create a new user
app.post("/users", (req, res) => {
  const users = readUsersFromFile();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name: req.body.name,
    age: req.body.age,
  };
  users.push(newUser);
  writeUsersToFile(users);
  setTimeout(() => {
    res.status(201).json(newUser);
  }, 2000);
});

// Update a user
app.put("/users/:id", (req, res) => {
  const users = readUsersFromFile();
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  setTimeout(() => {
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...req.body };
      writeUsersToFile(users);
      res.json(users[userIndex]);
    } else {
      res.status(404).send("User not found");
    }
  }, 2000);
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  let users = readUsersFromFile();
  const newUsers = users.filter((u) => u.id !== parseInt(req.params.id));
  setTimeout(() => {
    if (newUsers.length !== users.length) {
      writeUsersToFile(newUsers);
      res.send("User deleted");
    } else {
      res.status(404).send("User not found");
    }
  }, 2000);
});

// Server başlatma
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
