// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = 3001; // Frontend is on 5173, Backend on 3001

// app.use(cors()); // Allow frontend to talk to backend
// app.use(bodyParser.json());

// // -- MOCK DATABASE (Replace this with MongoDB later) --
// let books = [
//   { id: 1, title: "The Microservice Patterns", author: "Chris Richardson", price: 45.00, category: "Technical", description: "A detailed guide.", cover: "blue" },
//   { id: 2, title: "Kubernetes Up & Running", author: "Brendan Burns", price: 39.99, category: "DevOps", description: "K8s guide.", cover: "sky" }
// ];

// // -- API ROUTES --

// // GET all books
// app.get('/api/books', (req, res) => {
//   res.json(books);
// });

// // POST new book (Admin)
// app.post('/api/books', (req, res) => {
//   const newBook = { id: books.length + 1, ...req.body };
//   books.push(newBook);
//   res.status(201).json(newBook);
// });

// // PUT update book
// app.put('/api/books/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = books.findIndex(b => b.id === id);
//   if (index !== -1) {
//     books[index] = { ...books[index], ...req.body };
//     res.json(books[index]);
//   } else {
//     res.status(404).json({ message: "Book not found" });
//   }
// });

// // DELETE book
// app.delete('/api/books/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   books = books.filter(b => b.id !== id);
//   res.json({ message: "Deleted" });
// });

// app.listen(PORT, () => {
//   console.log(`Catalog Service running on http://localhost:${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// --- DATA STORE ---
// Added 'quantity' field to books
let books = [
  { id: 1, title: "The Microservice Patterns", author: "Chris Richardson", price: 45.00, category: "Technical", description: "A detailed guide.", cover: "blue", quantity: 10 },
  { id: 2, title: "Kubernetes Up & Running", author: "Brendan Burns", price: 39.99, category: "DevOps", description: "K8s guide.", cover: "sky", quantity: 5 },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", price: 32.50, category: "Programming", description: "Agile software craftsmanship.", cover: "indigo", quantity: 0 } // Out of stock example
];

let orders = []; 

// --- ROUTES ---

// 1. CATALOG SERVICE
app.get('/api/books', (req, res) => res.json(books));

app.post('/api/books', (req, res) => {
  const newBook = { id: Date.now(), ...req.body };
  // Ensure quantity is a number
  newBook.quantity = parseInt(newBook.quantity) || 0;
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index !== -1) {
    books[index] = { ...books[index], ...req.body };
    // Ensure quantity is a number
    books[index].quantity = parseInt(books[index].quantity) || 0;
    res.json(books[index]);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  books = books.filter(b => b.id !== id);
  res.json({ message: "Deleted" });
});

// 2. ORDER SERVICE (With Inventory Check)
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { items, shipping, userId, total } = req.body;

  // STEP 1: Check Stock Availability
  const insufficientStockItems = [];
  
  items.forEach(orderItem => {
    const book = books.find(b => b.id === orderItem.id);
    if (!book || book.quantity < orderItem.quantity) {
      insufficientStockItems.push(orderItem.title);
    }
  });

  if (insufficientStockItems.length > 0) {
    return res.status(400).json({ 
      message: `Not enough stock for: ${insufficientStockItems.join(", ")}` 
    });
  }

  // STEP 2: Deduct Stock
  items.forEach(orderItem => {
    const bookIndex = books.findIndex(b => b.id === orderItem.id);
    if (bookIndex !== -1) {
      books[bookIndex].quantity -= orderItem.quantity;
    }
  });

  // STEP 3: Create Order
  const newOrder = {
    id: `ORD-${Date.now()}`,
    date: new Date().toLocaleDateString(),
    status: 'Processing',
    items,
    shipping,
    userId,
    total
  };
  orders.unshift(newOrder); // Add to history
  
  res.status(201).json(newOrder);
});

app.listen(PORT, () => {
  console.log(`Microservices running on http://localhost:${PORT}`);
});