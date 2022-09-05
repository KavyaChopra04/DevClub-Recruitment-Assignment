import React, { useState } from "react";
import axios from "axios";
import {useEffect, useContext} from "react";
import {AuthContext} from '../helpers/AuthContext';
import {useNavigate} from 'react-router-dom';
function AddStaff() {
  let navigate=useNavigate();
  const [username, setUsername] = useState("");
  const {setAuthState}=useContext(AuthContext);
  const [admin, setAdmin]=useState("");
  useEffect(()=>{
    axios.get(`http://localhost:3001/users/bytoken/${localStorage.getItem("accessToken")}`).then((response)=>{
      setUsername(response.data.username);
      setAdmin(response.data.is_admin);
    })
  },[])

  const add = () => {
    const data = { username: username};
    if(!admin)
    {
        alert("You are not authorized to access this page!")
        navigate("/");
        return
    }
    axios.post("http://localhost:3001/addstaff", data).then((response) => {
        alert(response.data)
    });
    
  };
  return (
    <div className="loginContainer">
      <div>Welcome {admin}!</div>
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <button onClick={add}> Designate Member as Staff </button>
    </div>
  );
}

export default AddStaff;