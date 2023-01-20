import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileService from "../utils/profileService";
import NavBar from './NavBar';
import AddCalendar from "./AddCalendar"
import "../assets/Profile.css"

export default function Profile() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    useEffect(() => {
        ProfileService.getProfile()
        .then(res => {
            setName(res.data.first_name)
            setFullName(res.data.full_name)
            setEmail(res.data.email)
        })
        .catch(err => {
            if (err.response.status === 403) {
                navigate("/", { state: "Please Login First!" })
              }
        })
      }, [])

    return (
        <div>
            <NavBar />
            <div>
                <h1 className="profile-text">{name}'s Profile</h1>
                <table className="profile-table">
                    <thead><tr><td colSpan={2}><h3>Personal Information</h3></td></tr></thead>
                    <tbody>
                        <tr><td><strong>Email</strong></td><td>{email}</td></tr>
                        <tr><td><strong>Full Name</strong></td><td>{fullName}</td></tr>
                    </tbody>
                </table>
                <hr />
                <AddCalendar />
            </div>
        </div>
    )
}