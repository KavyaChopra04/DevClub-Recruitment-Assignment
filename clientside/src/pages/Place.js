import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import {Formik, Form, Field, ErrorMessage, useFormikContext} from 'formik';
import * as Yup from 'yup'
function Sport() {
let {name} =useParams();
const [username, setUsername]=useState("");
const [staff, setStaff]=useState("");
const [admin, setAdmin]=useState("");
const [SportName, setSportName] = useState("");
const [Slotsarr, setSlotsarr] = useState([]);
const [SportInventory, setSportInventory] = useState([]);
let navigate=useNavigate()
useEffect(()=>{
    axios.get(`http://localhost:3001/sports/${name}`).then((response)=>{
        console.log(response.data)
        setSportName(response.data.name);
        setSportInventory(response.data.inventory);
        console.log("array of slots" + Slotsarr)
    });
    axios.get(`http://localhost:3001/slotsbysport/${name}`).then((response)=>{
        setSlotsarr(response.data);
    });
    axios.get(`http://localhost:3001/users/bytoken/${localStorage.getItem("accessToken")}`).then((response)=>{
      setUsername(response.data.username);
      setAdmin(response.data.is_admin);
      setStaff(response.data.is_staff);
    });
}, [])
const initialValues={
  equipment: "",
  count: "", 
};
const initialValuesSlot={
  date: "06-09-2022",
  startTime: "16:30",
  endTime: "16:30",
  place:"Cricket Ground",
}
const validationSchema=Yup.object().shape({
  equipment: Yup.string().required(),
  count: Yup.number().required(),
});
const onSubmit=(data)=>{
  const item=data.equipment
  axios.post(`http://localhost:3001/sports/updateinventory/${name}/${item}`, data).then((response)=>{
    alert("Succesfully updated inventory. Refresh to load changes")
    navigate(`/sport/${name}`);
  })
};
const onSubmitslot=(data)=>{
  data.sport=SportName
  data.place=data.place.toUpperCase()
  axios.post(`http://localhost:3001/sports/addslot`, data).then((response)=>{
    alert(response.data)
    navigate(`/sport/${name}`);
  })
};
const deleteSport=(id)=>{
  axios.delete(`http://localhost:3001/sports/delete/${name}`).then((response)=>{
    alert("SUCCESSFULLY DELETED")
    navigate(`/sport/${name}`);
  })
}
const deleteInventory=(item)=>{
  axios.delete(`http://localhost:3001/sports/deleteinventory/${name}/${item}`).then((response)=>{
    alert("Succesfully deleted item from inventory")
    navigate("/");
  })
}
const deleteSlot=(data)=>{
  axios.put(`http://localhost:3001/sports/deleteslot`, data).then((response)=>{
    alert("Slot deleted successfully")
    navigate("/");
  })
}
const getbyid=(data)=>{
  axios.get(`http://localhost:3001/place/byId/${data}`).then((response)=>{
    
    console.log("ici")
    console.log(response)
    return response.data.name
  })
}
const bookSlot=(data)=>{
  data.username=username
  axios.put(`http://localhost:3001/sports/bookslot`, data).then((response)=>{
    
    alert(response.data)
    navigate(`/sport/${name}`);
  })
}
return (
  <div className="SportPage">
    <div className="inventory">
        <h1 className="title"> {SportName} </h1>
        <h3>Inventory</h3>
        {SportInventory.map((value, key)=>{
        return (
        <div className='post'>
        <div className='title' onClick={()=>{navigate(`/sport/${value.name}`)}}>{value.equipment} has a count of {value.count}</div>
        <div>{(staff || admin) && <button onClick={()=>{deleteInventory(value.equipment)}}>Delete the given item</button>}</div>
        <div>{(staff || admin) && <Formik initialValues={{"equipment" : value.equipment}} onSubmit={onSubmit} validationSchema={validationSchema}>
          <Form>
            <label>Equipment: </label>
            <ErrorMessage name="equipment" component="span" />
            <Field name="equipment" placeholder="" />
            <label>Count: </label>
            <ErrorMessage name="count" component="span" />
            <Field name="count" placeholder="" />
            <button>Update Item</button>
          </Form>
</Formik>}</div>
        </div>)
      })}
        <div>{(staff || admin) && <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          <Form>
            <label>Equipment: </label>
            <ErrorMessage name="equipment" component="span" />
            <Field name="equipment" placeholder="" />
            <label>Count: </label>
            <ErrorMessage name="count" component="span" />
            <Field name="count" placeholder="" />
            <button>Add Item</button>
          </Form>
</Formik>}</div>
        <div>{(staff || admin) && <button onClick={()=>{deleteSport(name)}}>Delete the Sport above</button>}</div>
      </div>
    <div className="slot">
      <h3>Available Slots</h3>
      <script>console.log(Slotsarr)</script>
      {Slotsarr.map((value, key)=>{
        return (
        <div className='post'>
        <div className='title'>Slot is on {value.date} from {value.startTime} to {value.endTime} at <Link to = {`/place/${value.place}`}>{value.place_name}</Link></div>
        <div>{value.is_booked && <div>The slot is currently booked</div>}</div>
        <div>{!value.is_booked && <div>The slot is currently free</div>}</div>
        <div>{!value.is_booked && <button onClick={()=>{bookSlot({"date" : value.date, "startTime" : value.startTime, "endTime":value.endTime })}}>Book this slot</button>}</div>
        <div>{(staff || admin) && <button onClick={()=>{deleteSlot({"date" : value.date, "startTime" : value.startTime, "endTime":value.endTime})}}>Delete this slot</button>}</div>
        <div></div>
        </div>)
      })}
    <div>{(staff || admin) && <Formik initialValues={initialValuesSlot} onSubmit={onSubmitslot}>
          <Form>
            <label>Date: (DD-MM-YYYY) </label>
            <ErrorMessage name="date" component="span" />
            <Field name="date" placeholder="" />
            <label>Start Time: (HH:MM)</label>
            <ErrorMessage name="startTime" component="span" />
            <Field name="startTime" placeholder="" />
            <label>End Time: (HH:MM)</label>
            <ErrorMessage name="endTime" component="span" />
            <Field name="endTime" placeholder="" />
            <label>Place Name </label>
            <ErrorMessage name="place" component="span" />
            <Field name="place" placeholder="" />
            <button>Add Slot</button>
          </Form>
</Formik>}</div>
    </div>
  </div>
);

}

export default Sport