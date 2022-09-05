import './App.css';
import React from "react";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Sport from "./pages/Sport";
import AddStaff from "./pages/AddStaff";
import DeleteStaff from "./pages/DeleteStaff";
import AddSport from "./pages/AddSport";
import {AuthContext} from './helpers/AuthContext';
import {useState} from "react";
function App() {
    const [AuthState, setAuthState]=useState(false);
    console.log("authstate is ", AuthState);
    return (
    <div>
      <AuthContext.Provider value={{AuthState, setAuthState}}>
        <Router>
          <Link to ="/">Home Page</Link>
          <br></br>
          {!AuthState && (
          <>
          <Link to="/login">Login</Link>
          <br></br>
          <Link to="/register">Registration</Link>
          <h1>{AuthState}</h1>
          </>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sport/:name" element={<Sport />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/addstaff" element = {<AddStaff />} />
            <Route path="/deletestaff" element = {<DeleteStaff />} />
            <Route path="/addsport" element = {<AddSport />} />
          </Routes>
        </Router>
        </AuthContext.Provider>
        
    </div>
  );
}

export default App;