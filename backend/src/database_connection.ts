import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Mongo_db_connection } from './keys';
dotenv.config();
const mongodb_connection : any = Mongo_db_connection ; 
async function database_making() {
  try {
    await mongoose.connect(mongodb_connection) ; 
    console.log("✅ Successfully connected to the database");
  } catch (err) {
    console.error("❌ Cannot connect to the database:", err);
  }
}

database_making();

interface IUser {
  title: string;
  description: string;
  id : number; 
}

interface IArray {
  name: string;
  password: string;
  email: string;
  array: IUser[];
}

const schema = new mongoose.Schema<IUser>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  id : {type : Number , required : true }
})

const schema_2 = new mongoose.Schema<IArray>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  array: [schema]
});

const User = mongoose.model<IUser>('Todo_app', schema);
const TotalDB = mongoose.model<IArray>('total_db', schema_2);

export { User, TotalDB };
