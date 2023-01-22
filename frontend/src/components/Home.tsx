import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Slide } from 'react-slideshow-image';
import AuthService from "../utils/authService";
import NavBar from "./NavBar";
import "../assets/Home.css"
import 'react-slideshow-image/dist/styles.css'

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
                <h1>Welcome to Futurum</h1>
                <h3>Your one-stop platform for social and group scheduling!</h3>
                <div className="home-body">
                    <Slide>
                        <div className="each-slide-effect">
                            <div id="slide1" >
                            </div>
                            <p><h5>Add events to your calendar to share with whoever you want!</h5></p>
                        </div>
                        <div className="each-slide-effect">
                            <div id="slide2" >
                            </div>
                            <p><h5>When shared, your family/friends can see your schedule. Use these information to plan your activities!</h5></p>
                        </div>
                        <div className="each-slide-effect">
                            <div id="slide3" >
                            </div>
                            <p><h5>You can also create journal entries to share with the people in your group!</h5></p>
                        </div>
                    </Slide>
                </div>
                <Alert className="home-alert" show={alert} variant={"danger"} onClose={() => setAlert(false)} dismissible>
                    {message}
                </Alert>
            </div>
        )
    }
}