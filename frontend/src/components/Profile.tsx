import { Formik, ErrorMessage, Field, Form } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileService from "../utils/profileService";
import NavBar from './NavBar';
import AddCalendar from "./AddCalendar"
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

      }

      function changePassword() {

      }

    return (
        <div>
            <NavBar />
            <br></br>
            <table border={1}>
                <thead><tr><th>Profile</th></tr></thead>
                <tbody>
                    <tr><td>Email:</td><td>{email}</td></tr>
                    <tr><td>Name:</td><td>{name}</td></tr>
                    <tr><td>Change Password:</td><td>
                    <Formik
                        initialValues={{"password": ""}}
                        validationSchema={validationSchema}
                        onSubmit={changePassword}
                    >
                        <Form>
                            <Field name="password" type="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="alert alert-danger" />
                        </Form>
                    </Formik>
                    </td></tr>
                    <tr><td></td>
                        <td>
                            <button type="submit" className="btn btn-primary btn-block">Change</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br></br>
            <AddCalendar />
        </div>
    )
}