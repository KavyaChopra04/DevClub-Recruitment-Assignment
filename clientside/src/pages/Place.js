import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
function Place() {
let {name} =useParams();
const [username, setUsername]=useState("");
const [placeObject, setPlaceObject] = useState({});
const [Reviews, setReviews] = useState([]);
const [newReview, setNewReview] = useState("");
const [admin, setAdmin]=useState("");
const [staff, setStaff]=useState("");
let navigate=useNavigate()
useEffect(()=>{
    axios.get(`http://localhost:3001/places/${name}`).then((response)=>{
      setPlaceObject(response.data);
      console.log("Place is ")
      console.log(response.data);
    });
axios.get(`http://localhost:3001/reviews/${name}`).then((response)=>{
      setReviews(response.data);
      console.log(response.data);
    });
    axios.get(`http://localhost:3001/users/bytoken/${localStorage.getItem("accessToken")}`).then((response)=>{
      setUsername(response.data.username);
      setAdmin(response.data.is_admin);
      setStaff(response.data.is_staff);
    });
}, [])
const addReview = () => {
  axios
    .post(`http://localhost:3001/addreview/${name}`, {
      text: newReview,
      username: username,
    },
    {
      headers:{
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      if(response.data.error)
      {
        console.log(response);
        alert("User not authenticated");
      }
      else{
        const ReviewToAdd = { reviewBody: newReview, author: response.data.author};
        setReviews([...Reviews, ReviewToAdd]);
        setNewReview("");
      }
      
    });
};
return (
  <div className="postPage">
    <div className="leftSide">
      <div className="post" id="individual">
        <div className="title"> Name of the Place is {placeObject.name} </div>
        <div className="body">Capacity of the Place is {placeObject.capacity}</div>
      </div>
    </div>
    <div className="rightSide">
      <div className="addReviewContainer">
        <input
          type="text"
          placeholder="Review..."
          autoComplete="off"
          value={newReview}
          onChange={(event) => {
            setNewReview(event.target.value);
          }}
        />
        <button onClick={addReview}> Add Review</button>
      </div>
      <div className="listOfReviews">
        {Reviews.map((Review, key) => {
          return (
            <div key={key} className="Review">
              {Review.text}
              <br></br>
              <label>Posted by: {Review.author}</label>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

}

export default Place