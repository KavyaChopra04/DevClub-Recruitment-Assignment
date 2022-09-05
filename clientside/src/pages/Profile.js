import React from 'react'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
function Profile() {
    let navigate=useNavigate();
    let {id}=useParams();
    const [username, setUsername]=useState("")
    const [Slotarr, setSlotarr]=useState([])
    useEffect(() => {
      axios.get(`http://localhost:3001/users/basicinfo/${id}`).then((response) => {
        setUsername(response.data.username);
      })
      axios.get(`http://localhost:3001/slots/byuserId/${id}`).then((response) => {
       
        setSlotarr(response.data);
      })
    }, [])
    
  return (
    <div className="profilepage">Profile Page
    <div className="basicinfo">
        <h1>Username: {username}</h1>
    </div>
    <div>List of this user's slots booked:</div>
    <div>
      {Slotarr.map((value, key)=>{
        return (
        <div className='slot' onClick={()=>{navigate(`/post/${value.id}`)}}>
        <div className='title'>Slot booked from {value.startTime} to {value.endTime} for {value.sportBooked.name} at {value.Place.name}</div>
        
        </div>)
      })}
    </div>
    
    </div>


  )
}

export default Profile