import React from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup'
import axios from "axios"
function Registration() {
    const initialValues={
        username: "",
        password: "", 
        email : ""
      };
      const validationSchema=Yup.object().shape({
        username: Yup.string().required(),
        password: Yup.string().required(),
        email: Yup.string().required(),
      });
      const onSubmit=(data)=>{
        axios.post("http://localhost:3001/register", data).then((response)=>{
          alert(response.data)
        })
      };
  return (
    
    <div>
      <h1>Registration page</h1>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          <Form>
            <label>Username: </label>
            <ErrorMessage name="username" component="span" />
            <Field name="username" placeholder="" />
            <label>Password: </label>
            <ErrorMessage name="password" component="span" />
            <Field name="password" placeholder="" />
            <label>EmailID: </label>
            <ErrorMessage name="email" component="span" />
            <Field name="email" placeholder="" />
            <button>Register</button>
          </Form>
      </Formik>
    </div>
  )
}
export default Registration;