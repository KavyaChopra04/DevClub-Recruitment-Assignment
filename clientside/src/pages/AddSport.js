import React from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
function AddSport() {
    let navigate=useNavigate()
    const initialValues={
        name: "",
      };
      const validationSchema=Yup.object().shape({
        name: Yup.string().required(),
      });
      const onSubmit=(data)=>{
        data.name=data.name.toUpperCase()
        axios.post("http://localhost:3001/addsport", data).then((response)=>{
          alert(response.data)
          alert("Redirecting to sports page")
          navigate(`/sport/${data.name}`)
        })
      };
  return (
    
    <div>
      <h1>Add Sport Page</h1>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          <Form>
            <label>Name: </label>
            <ErrorMessage name="name" component="span" />
            <Field name="name" placeholder="" />
            <button>Add Sport</button>
          </Form>
      </Formik>
    </div>
  )
}
export default AddSport;