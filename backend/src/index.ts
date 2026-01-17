import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; 
import { TotalDB } from './database_connection';


dotenv.config();
const app = express();
const port = process.env.Port_number || 3001 ;  

const saltRounds = 10; 

app.use(express.json());
app.use(cors());


app.post('/new_user', async (req, res): Promise<void> => {
  try {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      res.status(400).json({ msg: 'Please fill the required details' });
      return;
    }


    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new TotalDB({
      name : name ,
      email : email,
      password: hashedPassword, 
      array: [],
    });

    await newUser.save();

    res.status(201).json({ msg: 'User is created successfully' });
  } catch (err : any) {
  
    if (err.code === 11000) {
      res.status(409).json({ msg: 'Email already exists.' });
    } else {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
});


app.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ msg: 'Please provide email and password' });
      return;
    }

   
    const user = await TotalDB.findOne({ email : email });
    if (!user) {
      // User not found
      res.status(401).json({ msg: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
   
      res.status(401).json({ msg: 'Invalid credentials' });
      return;
    }


    res.status(200).json({
      msg: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        password : user.password
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});



async function authenticateUser(email : any) {
  try{
  const user = await TotalDB.findOne({ email : email });
  if (!user) return null;
  console.log("error") ; 
  return user ; 
  }
  catch(err){
    console.log(err) ; 
  }
}

app.post('/get_todo', async (req, res): Promise<any> => {
  const { email } = req.body;
  try {
    const user = await authenticateUser(email);
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

    const user = await authenticateUser(email);
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
  const { email, id } = req.body;
  try {
    const user = await authenticateUser(email);
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



app.get("/health" , function(req , res) {
  res.status(200).json({
    msg : "Server is running properly" 
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});