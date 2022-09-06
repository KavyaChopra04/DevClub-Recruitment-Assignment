import axios from "axios"
import {useEffect, useState} from "react";
import React from 'react'
import { useNavigate } from 'react-router-dom';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
function Home() {
    const [Sportsarr, fillarr] = useState([]);
    const [Placesarr, setPlacesarr] = useState([]);
    const [username, setUsername]=useState("");
    const [admin, setAdmin]=useState("");
    const [staff, setStaff]=useState("");
    const [_id, setId]=useState("");
    let navigate=useNavigate()
    const redirect = () => {
    if(!localStorage.getItem("accessToken"))
    {
      alert("Please login before ");
      navigate("/users/login");
    }
      
  };
  useEffect(()=>{
    axios.get("http://localhost:3001/sports").then((response)=>{
      fillarr(response.data);
      redirect();
    })
    axios.get("http://localhost:3001/places").then((response)=>{
      setPlacesarr(response.data);
      redirect();
    })
    axios.get(`http://localhost:3001/users/bytoken/${localStorage.getItem("accessToken")}`).then((response)=>{
      console.log(response.data)
      setUsername(response.data.username);
      setAdmin(response.data.is_admin);
      setStaff(response.data.is_staff);
      setId(response.data._id)
    })
  },[])

  return (
    <div> Home Page
      <div>Welcome {username}!</div>
      <div className='title' onClick={()=>{navigate(`/profile/${_id}`)}}>Click here to go to your profile page</div>
      <div>
        <h3>Sports available</h3>
        {Sportsarr.map((value, key)=>{
          return (
          <div className='post'>
          <div className='title' onClick={()=>{navigate(`/sport/${value.name}`)}}>{value.name}</div>
          </div>)
        })}
        <div>{(admin||staff) && <button><Link to={`/addsport`}>Add a new sport page</Link></button>}</div>
      </div>
      <div>
        <h3>Places available</h3>
        {Placesarr.map((value, key)=>{
          return (
          <div className='post'>
          <div className='title' onClick={()=>{navigate(`/place/${value.name}`)}}>{value.name}</div>
          </div>)
        })}
        <div>{(admin||staff) && <button><Link to={`/addplace`}>Add a new place page</Link></button>}</div>
      </div>
      <div>
        <div>{admin && <button><Link to={`/addstaff`}>Assign the role of staff to accounts</Link></button>}</div>
        <div>{admin && <button><Link to={`/deletestaff`}>Revoke the role of staff from accounts</Link></button>}</div>
    </div>
    </div>)
}

    
export default Home