

import axios from "axios";

import { type ReactElement, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage(): ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
 
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
   
      console.log("User found in localStorage, redirecting to dashboard...");
      navigate("/dashboard");
    }

  }, [navigate]); 

  async function handleLogin(): Promise<void> {
    setMessage("");
    setIsError(false);

    if (!email || !password) {
      setMessage("Please enter both email and password.");
      setIsError(true);
      return;
    }

    try {
      const response: any = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      const user = {
        name: response.data.user.name,
        email: response.data.user.email,
        password: password, 
      };
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setMessage("Login failed. Please check your credentials.");
      setIsError(true);
      console.error("Login error:", err);
    }
  }

  return (
    <div className="min-h-screen w-full grid place-items-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md grid gap-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Login to Your Account
        </h1>

        <div className="grid gap-4">
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

          <button
            onClick={handleLogin}
            className="bg-black text-white p-3 rounded-md hover:bg-gray-800 transition duration-200"
          >
            Login
          </button>
        </div>

        {message && (
          <div className={`text-center text-sm mt-2 ${isError ? "text-red-500" : "text-green-500"}`}>
            {message}
          </div>
        )}

        <div className="text-center mt-4 text-sm">
          <span>Don't have an account?</span>{" "}
          <Link to="/sign_up" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;