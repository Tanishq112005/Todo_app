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
exports.TotalDB = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const keys_1 = require("./keys");
dotenv_1.default.config();
const mongodb_connection = keys_1.Mongo_db_connection;
function database_making() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(mongodb_connection);
            console.log("✅ Successfully connected to the database");
        }
        catch (err) {
            console.error("❌ Cannot connect to the database:", err);
        }
    });
}
database_making();
const schema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    id: { type: Number, required: true }
});
const schema_2 = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    array: [schema]
});
const User = mongoose_1.default.model('Todo_app', schema);
exports.User = User;
const TotalDB = mongoose_1.default.model('total_db', schema_2);
exports.TotalDB = TotalDB;
