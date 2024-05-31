import express from 'express';
import pool from './db.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.get('/home', (req, res) => {
  res.status(200).json("Home endpoint is working");
});

app.post('/category', async (req, res) => {
  const {category_id,name } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO category (category_id,name) VALUES (?,?)",
      [category_id,name]
    );
    res.status(200).json({ message: "Category has been added", id: result.insertId });
  } catch (error) {
    console.error(`Failed to add category: ${error.message}`);
    res.status(400).json({ error: `Failed to add category: ${error.message}` });
  }
});

app.get('/category', async (req, res) => {
  try {
    const [category] = await pool.query("SELECT * FROM category");
    res.status(200).json(category);
  } catch (error) {
    console.error(`Failed to get categories: ${error.message}`);
    res.status(400).json({ error: `Failed to get categories: ${error.message}` });
  }
});


app.delete('/category/:category_id', async (req, res) => {
  const categoryId = req.params.category_id;

  try {
    // Execute SQL query to delete category by ID
    const result = await pool.query("DELETE FROM category WHERE category_id = ?", [categoryId]);

    // Check if any row was affected
    if (result.affectedRows === 0) {
      // If no row was affected, return a 404 error
      return res.status(404).json({ error: `Category with ID ${categoryId} not found` });
    }

    // If successful, return a success message
    res.status(200).json({ message: `Category with ID ${categoryId} has been deleted` });
  } catch (error) {
    // If an error occurs, return a 500 error with the error message
    console.error(`Failed to delete category: ${error.message}`);
    res.status(500).json({ error: `Failed to delete category: ${error.message}` });
  }
});

app.put('/category/:category_id', async (req, res) => {
  const categoryId = req.params.category_id;
  const newName = req.body.name;

  try {
    // Execute SQL query to update category name
    const result = await pool.query("UPDATE category SET name = ? WHERE category_id = ?", [newName, categoryId]);

    // Check if any row was affected
    if (result.affectedRows === 0) {
      // If no row was affected, return a 404 error
      return res.status(404).json({ error: `Category with ID ${categoryId} not found` });
    }

    // If successful, return the updated category
    res.status(200).json({ message: `Category with ID ${categoryId} has been updated`, name: newName });
  } catch (error) {
    // If an error occurs, return a 500 error with the error message
    console.error(`Failed to update category: ${error.message}`);
    res.status(500).json({ error: `Failed to update category: ${error.message}` });
  }
});

app.post('/projects', async (req, res) => {
  const { name, description, category_id } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO projects ( user_id ,name, description, category_id) VALUES (?, ?, ?, ?)",
      [1 , name, description, category_id]
    );
    res.status(200).json({ success: true, project: { project_id: result.insertId, name, description, category_id } });
  } catch (error) {
    console.error(`Failed to add project: ${error.message}`);
    res.status(400).json({ success: false, error: `Failed to add project: ${error.message}` });
  }
});

app.get('/projects', async (req, res) => {
  try {
    const [projects] = await pool.query("SELECT project_id, name, category_id FROM projects");
    res.status(200).json(projects);
  } catch (error) {
    console.error(`Failed to get projects: ${error.message}`);
    res.status(400).json({ error: `Failed to get projects: ${error.message}` });
  }
});

app.put('/project/:project_id', async (req, res) => {
  const projectId = req.params.project_id;
  const { name, category } = req.body;

  try {
    const result = await pool.query(
      "UPDATE projects SET name = ?, category_id = ? WHERE project_id = ?",
      [name, category, projectId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Project with ID ${projectId} not found` });
    }

    res.status(200).json({ success: true, message: `Project with ID ${projectId} has been updated` });
  } catch (error) {
    console.error(`Failed to update project: ${error.message}`);
    res.status(500).json({ error: `Failed to update project: ${error.message}` });
  }
});

app.delete('/project/:project_id', async (req, res) => {
  const projectId = req.params.project_id;

  try {
    const result = await pool.query("DELETE FROM projects WHERE project_id = ?", [projectId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Project with ID ${projectId} not found` });
    }

    res.status(200).json({ success: true, message: `Project with ID ${projectId} has been deleted` });
  } catch (error) {
    console.error(`Failed to delete project: ${error.message}`);
    res.status(500).json({ error: `Failed to delete project: ${error.message}` });
  }
});

app.post('/users', async (req, res) => {
  const { email, password } = req.body; // Changed from 'username' to 'email'

  try {
    // Query the database for the user with the provided email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      // If no user with the provided email is found, return an error
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Extract the user's password hash from the database
    const hashedPassword = users[0].password;

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      // If the passwords do not match, return an error
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // If the email and password match, return a success message
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});