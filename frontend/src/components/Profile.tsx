import { Formik, ErrorMessage, Field, Form } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileService from "../utils/profileService";
import NavBar from './NavBar';
import AddCalendar from "./AddCalendar"
import AuthService from "../utils/authService";
import * as Yup from "yup";

export default function Profile() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    useEffect(() => {
        ProfileService.getProfile()
        .then(res => {
            setName(res.data.full_name)
            setEmail(res.data.email)
        })
        .catch(error => {
            navigate("/login")
        })
      }, [])

    function validationSchema() {
        return Yup.object().shape({
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

      function changePassword(formValue: { password: string; passwordVal: string }) {
        const password= formValue.password;
        AuthService.changePassword(password)
      }

    return (
        <div>
            <NavBar />
            <br></br>
            <Formik
                initialValues={{"password": "", "passwordVal": ""}}
                validationSchema={validationSchema}
                onSubmit={changePassword}
            >
                <Form>
                <table border={1}>
                    <thead><tr><th>Profile</th></tr></thead>
                    <tbody>
                        <tr><td>Email:</td><td>{email}</td></tr>
                        <tr><td>Name:</td><td>{name}</td></tr>
                        <tr><td>Change Password:</td>
                            <td>
                                <Field name="password" type="password" className="form-control" />
                                <ErrorMessage name="password" component="div" className="alert alert-danger" />
                            </td>
                        </tr>
                        <tr><td>Re-Type New Password:</td>
                            <td>
                                <Field name="passwordVal" type="password" className="form-control" />
                                <ErrorMessage name="passwordVal" component="div" className="alert alert-danger" />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type="submit" className="btn btn-primary btn-block">Change</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </Form>
            </Formik>
            <br></br>
            <AddCalendar />
        </div>
    )
}