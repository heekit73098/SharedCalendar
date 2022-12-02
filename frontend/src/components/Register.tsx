import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../utils/authService";

type Props = {};

type State = {
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  successful: boolean,
  message: string
};

export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      successful: false,
      message: ""
    };
  }

  validationSchema() {
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

  handleRegister(formValue: { email: string; password: string; first_name: string; last_name: string }) {
    const { email, password, first_name, last_name } = formValue;

    this.setState({
      message: "",
      successful: false
    });

    AuthService.register(
      email,
      password,
      first_name,
      last_name
    ).then(
        (      response: { data: { message: any; }; }) => {
        this.setState({
          message: response.data.message,
          successful: true
        });
      },
        (      error: { response: { data: { message: any; }; }; message: any; toString: () => any; }) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          successful: false,
          message: resMessage
        });
      }
    );
  }

  render() {
    const { successful, message } = this.state;

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
            validationSchema={this.validationSchema}
            onSubmit={this.handleRegister}
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
