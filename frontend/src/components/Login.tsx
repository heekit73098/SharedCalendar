import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import logo from '../assets/logo-no-background.png'
import * as Yup from "yup";

import AuthService from "../utils/authService";
import NavBar from "./NavBar";

import "../assets/Login.css"

export default function Login() {
  const navigate = useNavigate()
  const [redirect, setRedirect] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    AuthService.getUser().then( res => setRedirect("/calendar")
    ).catch( err => {
        if (err.response.status === 403) {
            setRedirect("")
        }
    })
  }, [])

  function validationSchema() {
    return Yup.object().shape({
      username: Yup.string().required("This field is required!"),
      password: Yup.string().required("This field is required!"),
    });
  }

  function handleLogin(formValue: { username: string; password: string }) {
    const { username, password } = formValue;
    setMessage("")
    setLoading(true)

    AuthService.login(username, password).then(
      (res) => { 
        navigate('/calendar')
      }
    ).catch(
      error => {
        setLoading(false)
        setMessage(error.response.data.message)
      })
  }

  if (redirect !== "") {
    return <Navigate to={redirect} />
  } else {
    const initialValues = {
      username: "",
      password: "",
    };

    return (
      <div>
        <NavBar />
        <div className="login-form">
          <img src={logo} alt="Futurum" width="200px" height = "50px"/>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            <Form>
              <div className="form-group">
                <label htmlFor="username">Email</label>
                <Field name="username" type="text" className="form-control" />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group-button">
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Login</span>
                </button>
              </div>

              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
          <div className="nav-register">
            <span>Need an account? </span>
            <a href="/register">Sign Up Now!</a>
          </div>
        </div>
      </div>
    );
  }
}
