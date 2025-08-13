// src/new_signup_route.tsx

import axios from "axios";
import { type ReactElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp(): ReactElement {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  async function handleSignUp(): Promise<void> {
    setMessage("");
    setIsError(false);

    try {
      await axios.post("http://localhost:3001/new_user", {
        name,
        email,
        password,
        mobile
      });

  
      
      setMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/"); 
      }, 2000);

    } catch (err : any) {
     
      const errorMessage = err.response?.data?.msg || "Invalid details or server error.";
      setMessage(errorMessage);
      setIsError(true);
    }
  }

  return (
    <div className="min-h-screen w-full grid place-items-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md grid gap-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Create Your Account
        </h1>

        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="text"
            placeholder="Mobile Number (Optional)"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          /> 
          <button
            onClick={handleSignUp}
            className="bg-black text-white p-3 rounded-md hover:bg-gray-800 transition duration-200"
          >
            Sign Up
          </button>
        </div>

        {message && (
          <div className={`text-center text-sm mt-2 ${isError ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </div>
        )}

        <div className="text-center mt-4 text-sm">
          <span>Already have an account?</span>{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login 
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;