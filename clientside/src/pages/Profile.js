import React from 'react'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
function Profile() {
    let navigate=useNavigate();
    let {id}=useParams();
    const [username, setUsername]=useState("")
    const [email, setEmail]=useState("")
    const [Slotarr, setSlotarr]=useState([])
    useEffect(() => {
      axios.get(`http://localhost:3001/users/bytoken/${localStorage.getItem("accessToken")}`).then((response)=>{
      setUsername(response.data.username);
      setEmail(response.data.email)
    })
      axios.get(`http://localhost:3001/slots/byuserId/${id}`).then((response) => {
       
        setSlotarr(response.data);
      })
    }, [])
    
  return (
    <div className="profilepage">Profile Page
    <div className="basicinfo">
        <h1>Username: {username}</h1>
        <h2>email: {email}</h2>
    </div>
    <div><h2>List of this user's slots booked:</h2></div>
    <div>
      {Slotarr.map((value, key)=>{
        return (
        <div className='slot'>
        <div className='title'>Slot booked from {value.startTime} to {value.endTime} at {value.place_name}</div>
        <br></br>
        </div>)
      })}
    </div>
    
    </div>


  )
}

export default Profile