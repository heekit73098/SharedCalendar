import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../utils/authService";

export default function Login() {
  const [redirect, setRedirect] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const navigate = useNavigate();
//   componentDidMount() {
//     const currentUser = AuthService.getCurrentUser();

//     if (currentUser) {
//       this.setState({ redirect: "/profile" });
//     };
//   }

//   componentWillUnmount() {
//     window.location.reload();
//   }

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
        setRedirect("/calendar")
        console.log(res)
      },
      error => {
        setLoading(false)
        setMessage(error.message)
      }
    );
  }

  if (redirect !== "") {
    return <Navigate to={redirect} />
  } else {
    const initialValues = {
      username: "",
      password: "",
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            <Form>
              <div className="form-group">
                <label htmlFor="username">Username/Email</label>
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

              <div className="form-group">
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
        </div>
        <div>
          <button
            type="button"
            className="btn btn-default btn-sm move-today"
            data-action="move-today"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    );
  }
}
