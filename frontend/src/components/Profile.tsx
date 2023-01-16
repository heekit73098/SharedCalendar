import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileService from "../utils/profileService";
import NavBar from './NavBar';
import AddCalendar from "./AddCalendar"

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

    return (
        <div>
            <NavBar />
            <br></br>
                <table border={1}>
                    <thead><tr><th>Profile</th></tr></thead>
                    <tbody>
                        <tr><td>Email:</td><td>{email}</td></tr>
                        <tr><td>Name:</td><td>{name}</td></tr>
                    </tbody>
                </table>
            <br></br>
            <AddCalendar />
        </div>
    )
}