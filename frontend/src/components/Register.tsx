import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import * as Yup from "yup";
import logo from '../assets/logo-no-background.png'

import AuthService from "../utils/authService";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

import "../assets/Register.css"

export default function Register() {
  const [successful, setSuccessful] = useState(false)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const popup = "Password should be 8-30 characters long<br />At least one<ul><li>Lowercase Letter</li><li>Uppercase Letter</li><li>Special Character</li><li>Digit</li></ul>"

  useEffect(() => {
    AuthService.getUser().then( res => navigate("/calendar")
    ).catch( err => {
        if (err.response.status === 403) {
          setSuccessful(false)
        }
    })
  }, [])
  
  function validationSchema() {
    return Yup.object().shape({
      email: Yup.string()
        .email("This is not a valid email.")
        .required("This field is required!"),
      password: Yup.string()
        .min(8, "Must be 8 characters or more")
        .max(30, "Not more than 30 characters")
        .matches(/[a-z]+/, "One lowercase character")
        .matches(/[A-Z]+/, "One uppercase character")
        .matches(/[@$!%*#?&]+/, "One special character")
        .matches(/\d+/, "One number")
        .required("This field is required!"),
      passwordVal: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required("This field is required!")
    });
  }

  function handleRegister(formValue: { email: string; password: string; first_name: string; last_name: string; passwordVal: string }) {
    const { email, password, first_name, last_name } = formValue;

    setMessage("")
    setSuccessful(false)

    AuthService.register(
      email,
      password,
      first_name,
      last_name
    ).then(
        (response: { data: { message: any; }; }) => {
          setMessage(response.data.message)
          setSuccessful(true)
        })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setSuccessful(false)
        setMessage(resMessage)
      }
    );
  }

  const initialValues = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    passwordVal: ""
  };

  return (
    <div className="col-md-12">
      <NavBar />
      <div className="register-form">
        <img src={logo} alt="Futurum" width="200px" height = "50px"/>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            {!successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="email"> Email </label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="first_name"> First Name </label>
                  <Field name="first_name" type="text" className="form-control" />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name"> Last Name </label>
                  <Field name="last_name" type="text" className="form-control" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password"> Password <a id="props-basic"><span>&#9432;</span> </a> <Tooltip anchorId="props-basic" html={popup} /> </label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="passwordVal"> Re-Type Password </label>
                  <Field
                    name="passwordVal"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="passwordVal"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                </div>
              </div>
            )}

            {message && (
              <div className="form-group">
                <div
                  className={
                    successful ? "alert alert-success" : "alert alert-danger"
                  }
                  role="alert"
                >
                  {message}
                </div>
                <button type="button" className="btn btn-primary btn-block" onClick={() => navigate("/login")}>Go To Login</button>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
}
