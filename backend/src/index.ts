import express from 'express';

import { TotalDB } from './database_connection';
import cors from 'cors';
import dotenv from 'dotenv';
import { Port_number } from './keys';
dotenv.config();
const app = express();
const port = Port_number;

app.use(express.json());
app.use(cors());

app.post('/new_user', async (req, res): Promise<void> => {
  try {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      res.status(400).json({ msg: 'Please fill the required details' });
      return;
    }

    const new_user = new TotalDB({
      name,
      password,
      email,
      array: [],
    });

    await new_user.save();

    res.status(200).json({ msg: 'User is created' });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

app.post('/todo', async (req, res): Promise<void> => {
  try {
    const { name, email, password, title, description } = req.body;

    if (!title || !description || !name || !email || !password) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    const user = await TotalDB.findOne({ name, email, password });

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const newTodo = {
      title,
      description,
      id: user.array.length,
    };

    user.array.push(newTodo);
    await user.save();

    res.status(201).json({ message: 'Todo saved successfully.' });
  } catch (err) {
    console.error('Error saving todo:', err);
    res.status(500).json({ message: 'Failed to save todo' });
  }
});

app.post('/get_todo', async (req, res): Promise<void> => {
  const { name, password, email } = req.body;

  if (!name || !password || !email) {
    res.status(400).json({ message: 'Name, Password, and Email are required.' });
    return;
  }

  try {
    const user = await TotalDB.findOne({ name, password, email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user.array);
  } catch (err) {
    console.error('Error finding user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/complete_todo', async (req, res) => {
  const { name, password, email, id } = req.body;

  if (!name || !password || !email ) {
    res.status(400).json({ message: 'Name, Password, Email, and key are required.' });
    return;
  }

  try {
    const user = await TotalDB.findOne({ name, password, email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    const newArray = user.array
      .filter((todo) => todo.id !== id)
      .map((todo, index) => ({
        ...todo,
        id: index,
      }));

    user.array = newArray;
    await user.save();

    res.status(200).json({  updatedTodos: user.array });
  } catch (err) {
    console.error('Error updating todos:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
