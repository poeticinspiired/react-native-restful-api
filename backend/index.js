/*
StAuth10244: I Abdi Sidnoor,000776285 certify that this material is my original work. 
No other person's work has been used without due acknowledgement. 
I have not made my work available to anyone else.
*/



const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create the "items" table
db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    kilometers INTEGER NOT NULL
  )
`);

// Default root route
app.get('/', (req, res) => {
    res.send('Welcome to the API! Use /api/ to access the collection of items.');
  });

// Collection Routes

// GET /api/ - Retrieve the entire collection
app.get('/api/', (req, res) => {
  const query = 'SELECT * FROM items';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error retrieving collection:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(rows);
  });
});

// PUT /api/ - Replace the entire collection
app.put('/api/', (req, res) => {
  const newCollection = req.body;

  if (!Array.isArray(newCollection)) {
    return res.status(400).json({ error: 'Request body must be an array of items.' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.run('DELETE FROM items', function (err) {
      if (err) {
        console.error('Error deleting collection:', err.message);
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const stmt = db.prepare('INSERT INTO items (make, model, year, kilometers) VALUES (?, ?, ?, ?)');
      for (const item of newCollection) {
        if (!item.make || !item.model || !item.year || !item.kilometers) {
          console.error('Invalid item:', item);
          db.run('ROLLBACK');
          return res.status(400).json({ error: 'Each item must have make, model, year, and kilometers.' });
        }
        stmt.run([item.make, item.model, item.year, item.kilometers]);
      }
      stmt.finalize((err) => {
        if (err) {
          console.error('Error finalizing statement:', err.message);
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        db.run('COMMIT', (err) => {
          if (err) {
            console.error('Error committing transaction:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          res.json({ status: 'REPLACE COLLECTION SUCCESSFUL' });
        });
      });
    });
  });
});

// POST /api/ - Add a new item to the collection
app.post('/api/', (req, res) => {
  const { make, model, year, kilometers } = req.body;

  if (!make || !model || !year || !kilometers) {
    return res.status(400).json({ error: 'All fields (make, model, year, kilometers) are required.' });
  }

  const query = 'INSERT INTO items (make, model, year, kilometers) VALUES (?, ?, ?, ?)';
  db.run(query, [make, model, year, kilometers], function (err) {
    if (err) {
      console.error('Error adding item:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(201).json({ status: 'CREATE ENTRY SUCCESSFUL', id: this.lastID });
  });
});

// DELETE /api/ - Delete the entire collection
app.delete('/api/', (req, res) => {
  const query = 'DELETE FROM items';
  db.run(query, [], function (err) {
    if (err) {
      console.error('Error deleting collection:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ status: 'DELETE COLLECTION SUCCESSFUL' });
  });
});

// Item Routes

// GET /api/:id - Retrieve a single item by ID
app.get('/api/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM items WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error(`Error retrieving item with ID ${id}:`, err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Item not found.' });
    }
  });
});

// PUT /api/:id - Update a single item by ID
app.put('/api/:id', (req, res) => {
  const { id } = req.params;
  const { make, model, year, kilometers } = req.body;

  if (!make || !model || !year || !kilometers) {
    return res.status(400).json({ error: 'All fields (make, model, year, kilometers) are required.' });
  }

  const query = 'UPDATE items SET make = ?, model = ?, year = ?, kilometers = ? WHERE id = ?';
  db.run(query, [make, model, year, kilometers, id], function (err) {
    if (err) {
      console.error(`Error updating item with ID ${id}:`, err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found.' });
    } else {
      res.json({ status: 'UPDATE ITEM SUCCESSFUL' });
    }
  });
});

// DELETE /api/:id - Delete a single item by ID
app.delete('/api/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM items WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) {
      console.error(`Error deleting item with ID ${id}:`, err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found.' });
    } else {
      res.json({ status: 'DELETE ITEM SUCCESSFUL' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
