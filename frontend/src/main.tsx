import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import LoginPage from "./login_page";
import SignUp from "./new_signup_route";
import Dashboard from "./Dashboard";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './landingpage';
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage></LoginPage>,
  },
  {
    path : "/" ,
    element : <LandingPage></LandingPage>
  } , 
  
  {
    path : "/sign_up" , 
    element : <SignUp></SignUp>
  } , 
  {
    path : "/dashboard",
    element : <Dashboard></Dashboard>
  } 
  ]);



createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
