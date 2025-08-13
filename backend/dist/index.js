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
const database_connection_1 = require("./database_connection");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const keys_1 = require("./keys");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = keys_1.Port_number;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post('/new_user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password, email } = req.body;
        if (!name || !password || !email) {
            res.status(400).json({ msg: 'Please fill the required details' });
            return;
        }
        const new_user = new database_connection_1.TotalDB({
            name,
            password,
            email,
            array: [],
        });
        yield new_user.save();
        res.status(200).json({ msg: 'User is created' });
    }
    catch (err) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}));
app.post('/todo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, title, description } = req.body;
        if (!title || !description || !name || !email || !password) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }
        const user = yield database_connection_1.TotalDB.findOne({ name, email, password });
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
        yield user.save();
        res.status(201).json({ message: 'Todo saved successfully.' });
    }
    catch (err) {
        console.error('Error saving todo:', err);
        res.status(500).json({ message: 'Failed to save todo' });
    }
}));
app.post('/get_todo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
        res.status(400).json({ message: 'Name, Password, and Email are required.' });
        return;
    }
    try {
        const user = yield database_connection_1.TotalDB.findOne({ name, password, email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user.array);
    }
    catch (err) {
        console.error('Error finding user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.post('/complete_todo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, email, id } = req.body;
    if (!name || !password || !email) {
        res.status(400).json({ message: 'Name, Password, Email, and key are required.' });
        return;
    }
    try {
        const user = yield database_connection_1.TotalDB.findOne({ name, password, email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
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
