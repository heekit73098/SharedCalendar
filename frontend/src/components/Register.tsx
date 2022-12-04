import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../utils/authService";
import { Navigate } from "react-router-dom";

export default function Register() {
  const [successful, setSuccessful] = useState(false)
  const [message, setMessage] = useState("")

  function validationSchema() {
    return Yup.object().shape({
      email: Yup.string()
        .email("This is not a valid email.")
        .required("This field is required!"),
      password: Yup.string()
        .test(
          "len",
          "The password must be between 8 and 40 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 8 &&
            val.toString().length <= 40
        )
        .required("This field is required!"),
    });
  }

  function handleRegister(formValue: { email: string; password: string; first_name: string; last_name: string }) {
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

  if (successful) {
    return <Navigate to={"/login"} />
  } else {
    const initialValues = {
      email: "",
      password: "",
      first_name: "",
      last_name: ""
    };
  
    return (
      <div className="col-md-12">
        <div className="card card-container">
  
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
                    <label htmlFor="password"> Password </label>
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
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    );
  }
}
