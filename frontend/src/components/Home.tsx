import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../utils/authService";
import NavBar from "./NavBar";
import "../assets/Home.css"

export default function Home() {
    const [authenticated, setAuthenticated] = useState(false)
    const [alert, setAlert] = useState(false)
    const [message, setMessage] = useState(false)
    const {state} = useLocation()
    useEffect(() => {
        AuthService.getUser().then( res => setAuthenticated(true)
        ).catch( err => {
            if (err.response.status === 403) {
                setAuthenticated(false)
            }
        })
        if (state) {
            setAlert(true)
            setMessage(state)
        }
    }, [])

    if (authenticated) {
        return <Navigate to={"/calendar"}/>
    } else {
        return (
            <div>
                <NavBar />
                <div className="home-body">
                    <h1>Welcome to Futurum </h1>
                </div>
                <Alert className="home-alert" show={alert} variant={"danger"} onClose={() => setAlert(false)} dismissible>
                    {message}
                </Alert>
            </div>
        )
    }
}