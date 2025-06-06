import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Coach from "./pages/Coach.tsx";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress.tsx";
import Blog from "./pages/Blog.tsx"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/coach" element={<Coach/>}/>
            <Route path="/workouts" element={<Workouts/>}/>
            <Route path="/nutrition" element={<Nutrition/>}/>
            <Route path="/progress" element={<Progress/>}/>
            <Route path="/blog" element={<Blog/>}/>
          </Routes>
          <Toaster position="top-right"/>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;