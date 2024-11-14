const express = require("express");
const fs = require("fs");
var cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors());
const waitTime = 0;
// JSON dosyasını okuyan yardımcı fonksiyon
const readUsersFromFile = () => {
  const data = fs.readFileSync("users.json");
  return JSON.parse(data);
};

// JSON dosyasına yazan yardımcı fonksiyon
const writeUsersToFile = (data) => {
  fs.writeFileSync("users.json", JSON.stringify(data, null, 2));
};

// Get all users with pagination
app.get("/users", (req, res) => {
  const users = readUsersFromFile();
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  // Calculate start and end indexes for pagination
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Slice the users array to get the paginated results
  const paginatedUsers = users.slice(startIndex, endIndex);

  // Simulate delay and respond with paginated data
  setTimeout(() => {
    res.json({
      pageNumber,
      pageSize,
      totalUsers: users.length,
      totalPages: Math.ceil(users.length / pageSize),
      users: paginatedUsers,
    });
  }, waitTime);
});


// Get a user by ID
app.get("/users/:id", (req, res) => {
  const users = readUsersFromFile();
  const user = users.find((u) => u.id === parseInt(req.params.id));
  setTimeout(() => {
    if (user) res.json(user);
    else res.status(404).send("User not found");
  }, waitTime);
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
  }, waitTime);
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
  }, waitTime);
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
  }, waitTime);
});

// Dummy data for the example
const dummyData = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
  description: `Description for item ${index + 1}`,
}));

// Endpoint to fetch paginated data
app.get('/api/data', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const size = parseInt(req.query.size, 10) || 20; // Default to 20 items per page

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;

  const paginatedData = dummyData.slice(startIndex, endIndex);

  res.json({
      items: paginatedData,
      totalCount: dummyData.length,
  });
});

// Server başlatma
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
