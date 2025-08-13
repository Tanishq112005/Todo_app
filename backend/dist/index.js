"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_connection_1 = require("./database_connection");
const keys_1 = require("./keys");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = keys_1.Port_number || 3001;
const saltRounds = 10;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post('/new_user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password, email } = req.body;
        if (!name || !password || !email) {
            res.status(400).json({ msg: 'Please fill the required details' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const newUser = new database_connection_1.TotalDB({
            name: name,
            email: email,
            password: hashedPassword,
            array: [],
        });
        yield newUser.save();
        res.status(201).json({ msg: 'User is created successfully' });
    }
    catch (err) {
        if (err.code === 11000) {
            res.status(409).json({ msg: 'Email already exists.' });
        }
        else {
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ msg: 'Please provide email and password' });
            return;
        }
        const user = yield database_connection_1.TotalDB.findOne({ email: email });
        if (!user) {
            // User not found
            res.status(401).json({ msg: 'Invalid credentials' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ msg: 'Invalid credentials' });
            return;
        }
        res.status(200).json({
            msg: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}));
function authenticateUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield database_connection_1.TotalDB.findOne({ email: email });
            if (!user)
                return null;
            console.log("error");
            return user;
        }
        catch (err) {
            console.log(err);
        }
    });
}
app.post('/get_todo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield authenticateUser(email);
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        res.status(200).json(user.array);
    }
    catch (err) {
        console.error('Error finding user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.post('/todo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, title, description } = req.body;
        const user = yield authenticateUser(email);
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
        yield user.save();
        res.status(201).json({ message: 'Todo saved successfully.', updatedTodos: user.array });
    }
    catch (err) {
        console.error('Error saving todo:', err);
        res.status(500).json({ message: 'Failed to save todo' });
    }
}));
app.post('/complete_todo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, id } = req.body;
    try {
        const user = yield authenticateUser(email);
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        // Filter and remap IDs to keep them sequential
        const newArray = user.array
            .filter((todo) => todo.id !== id)
            .map((todo, index) => (Object.assign(Object.assign({}, todo), { id: index })));
        user.array = newArray;
        yield user.save();
        res.status(200).json({ updatedTodos: user.array });
    }
    catch (err) {
        console.error('Error updating todos:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
