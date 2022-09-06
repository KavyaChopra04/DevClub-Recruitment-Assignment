import React from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
function AddPlace() {
    let navigate=useNavigate()
    const initialValues={
        name: "",
        capacity: ""
      };
      const validationSchema=Yup.object().shape({
        name: Yup.string().required(),
      });
      const onSubmit=(data)=>{
        data.name=data.name.toUpperCase()
        console.log(data)
        axios.post("http://localhost:3001/addplace", data).then((response)=>{
          alert(response.data)
          alert("Redirecting to place page")
          navigate(`/`)
        })
      };
  return (
    
    <div>
      <h1>Add Place Page</h1>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          <Form>
            <label>Name: </label>
            <ErrorMessage name="name" component="span" />
            <Field name="name" placeholder="" />
            <label>Capacity: </label>
            <ErrorMessage name="capacity" component="span" />
            <Field name="capacity" placeholder="" />
            <button>Add Place</button>
          </Form>
      </Formik>
    </div>
  )
}
export default AddPlace;