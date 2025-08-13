import { type ReactElement } from "react";
import { Link } from "react-router-dom";


const heroImageUrl = "/hero-background.jpg";

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

function LandingPage(): ReactElement {
  return (
   
    <div className="flex min-h-screen flex-col bg-slate-900 text-white">
    
      <header className="absolute top-0 left-0 w-full z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white">
            Momentum
          </Link>
          <div className="flex items-center gap-x-6">
            <Link
              to="/login"
              className="hidden sm:block text-sm font-semibold leading-6 text-slate-100 transition hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/sign_up"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      
      <main className="relative flex-1 flex items-center justify-center">
        
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        >
         
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
        </div>

    
        <div className="relative isolate px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
                Regain Your Focus.
              </span>
              <br />
              Master Your Day.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Momentum is a minimalist todo app designed to cut through the
              noise, helping you focus on what truly matters. Turn chaos into
              clarity, one task at a time.
            </p>
            <div className="mt-10">
              <Link
                to="/sign_up"
                className="rounded-md bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
      </main>

     
      <footer className="w-full bg-slate-900 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-8 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a
              href="https://www.linkedin.com/in/tanishq-jain-6b90b1292/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition"
            >
              <span className="sr-only">LinkedIn</span>
              <LinkedinIcon />
            </a>
            <a
              href="https://github.com/Tanishq112005/Todo_app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition"
            >
              <span className="sr-only">GitHub</span>
              <GithubIcon />
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-slate-500">
              © 2025 Momentum. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;