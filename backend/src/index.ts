import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; // <-- Import bcrypt
import { TotalDB } from './database_connection';
import { Port_number } from './keys';

dotenv.config();
const app = express();
const port = Port_number || 3001; // Fallback to 3001 if not set

const saltRounds = 10; // The cost factor for hashing

app.use(express.json());
app.use(cors());

// --- 1. Secure User Creation (Sign Up) ---
app.post('/new_user', async (req, res): Promise<void> => {
  try {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      res.status(400).json({ msg: 'Please fill the required details' });
      return;
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new TotalDB({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      array: [],
    });

    await newUser.save();

    res.status(201).json({ msg: 'User is created successfully' });
  } catch (err : any) {
    // Handle potential duplicate email error from the database
    if (err.code === 11000) {
      res.status(409).json({ msg: 'Email already exists.' });
    } else {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
});

// --- 2. New Secure User Login Route ---
app.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ msg: 'Please provide email and password' });
      return;
    }

    // Find the user by their unique email
    const user = await TotalDB.findOne({ email });
    if (!user) {
      // User not found
      res.status(401).json({ msg: 'Invalid credentials' });
      return;
    }

    // Compare the submitted password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Password does not match
      res.status(401).json({ msg: 'Invalid credentials' });
      return;
    }

    // Login successful
    res.status(200).json({
      msg: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        // DO NOT send the password back, even the hash
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


// --- 3. Updated Todo Routes (Using password check for auth) ---

// This is a helper function to avoid repeating authentication logic
async function authenticateUser(email : any, password : any) {
  const user = await TotalDB.findOne({ email });
  if (!user) return null;
  
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
}

app.post('/get_todo', async (req, res): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    res.status(200).json(user.array);
  } catch (err) {
    console.error('Error finding user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/todo', async (req, res): Promise<any> => {
  try {
    const { email, password, title, description } = req.body;

    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }

    const newTodo = {
      title,
      description,
      id: user.array.length,
    };

    user.array.push(newTodo);
    await user.save();

    res.status(201).json({ message: 'Todo saved successfully.', updatedTodos: user.array });
  } catch (err) {
    console.error('Error saving todo:', err);
    res.status(500).json({ message: 'Failed to save todo' });
  }
});

app.post('/complete_todo', async (req, res) => {
  const { email, password, id } = req.body;
  try {
    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    // Filter and remap IDs to keep them sequential
    const newArray = user.array
      .filter((todo) => todo.id !== id)
      .map((todo, index) => ({
        ...todo,
        id: index,
      }));

    user.array = newArray;
    await user.save();

    res.status(200).json({ updatedTodos: user.array });
  } catch (err) {
    console.error('Error updating todos:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});