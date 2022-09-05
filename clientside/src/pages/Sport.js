import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup'
import { render } from 'react-dom';
import { redirect } from 'next/dist/server/api-utils';
import SecondsTimePicker from "./TimePicker";
function Sport() {
let {name} =useParams();
const [username, setUsername]=useState("");
const [staff, setStaff]=useState("");
const [admin, setAdmin]=useState("");
const [SportName, setSportName] = useState("");
const [SportInventory, setSportInventory] = useState([]);
let navigate=useNavigate()
useEffect(()=>{
    axios.get(`http://localhost:3001/sports/${name}`).then((response)=>{
        console.log(response.data)
        setSportName(response.data.name);
        setSportInventory(response.data.inventory);
        console.log(SportInventory)
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
  const item=data.equipment
  axios.post(`http://localhost:3001/sports/addslot`, data).then((response)=>{
    alert("Succesfully added slot. Refresh to load changes")
    navigate(`/sport/${name}`);
  })
};
const deleteSport=(id)=>{
  axios.delete(`http://localhost:3001/sports/delete/${name}`).then((response)=>{
    alert("SUCCESSFULLY DELETED")
    redirect(`/sport/${name}`);
  })
}
const deleteInventory=(item)=>{
  axios.delete(`http://localhost:3001/sports/deleteinventory/${name}/${item}`).then((response)=>{
    alert("Succesfully deleted item from inventory")
    navigate("/");
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
    <div>{(staff || admin) && <Formik initialValues={initialValues} onSubmit={onSubmitslot} validationSchema={validationSchema}>
          <Form>
            <label>Start Time: </label>
            <ErrorMessage name="startTime" component="span" />
            <Field name="startTime" placeholder="">
            <SecondsTimePicker />
            </Field>
            <label>End Time: </label>
            <ErrorMessage name="endTime" component="span" />
            <Field name="endTime" placeholder="" />
            <label>Place: </label>
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