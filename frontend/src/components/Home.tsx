import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthService from "../utils/authService";
import NavBar from "./NavBar";

export default function Home() {
    const [authenticated, setAuthenticated] = useState(false)
    useEffect(() => {
        AuthService.getUser().then( res => setAuthenticated(true)
        ).catch( err => {
            if (err.response.status === 403) {
                setAuthenticated(false)
            }
        })
    }, [])

    if (authenticated) {
        return <Navigate to={"/calendar"}/>
    } else {
        return (
            <div>
                <NavBar />
                <div>
                    <h1>Welcome to Futurum</h1>
                </div>
            </div>
        )
    }
}