import axios from "axios";
import { type ReactElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const heroImageUrl = "/hero-background.jpg";

function SignUp(): ReactElement {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignUp(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    if (!name || !email || !password) {
      setMessage("Please fill in all required fields (Name, Email, Password).");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("https://momentum-fwju.onrender.com/new_user", {
        name,
        email,
        password,
        mobile,
      });

      setMessage("Account created successfully! Redirecting to login...");
      setIsError(false);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.msg || "An error occurred. Please try again.";
      setMessage(errorMessage);
      setIsError(true);
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      {/* Background Image and Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="absolute inset-0 bg-slate-900/70"></div>
      </div>


      <div className="relative bg-slate-800/70 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md grid gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-100">
          Join Momentum
        </h1>

        <form onSubmit={handleSignUp} className="grid gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          />

          <input
            type="tel"
            placeholder="Mobile Number (Optional)"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            disabled={isLoading}
            className="p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white p-3 rounded-md font-semibold hover:bg-indigo-500 transition-colors duration-200 flex items-center justify-center disabled:bg-indigo-500/50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <div
            className={`text-center text-sm mt-2 ${
              isError ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </div>
        )}

        <div className="text-center mt-4 text-sm text-slate-400">
          <span>Already have an account?</span>{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;