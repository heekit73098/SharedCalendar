import { useEffect, useState } from "react";
import LoginScreen from "react-native-login-screen";
import { useColorScheme, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
import AuthService from "../utils/authService";
import * as SecureStore from 'expo-secure-store';
import { useAuthState, AuthStateInterface } from "../utils/authContext";



const LoginForm = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const colorScheme = useColorScheme();
    const { state } = useAuthState()
    const { setState } = useAuthState()

    function handleRegister() {
        router.replace("/register")
    }

    function handleLogin() {
        console.log(password, email);
        AuthService.login(email, password).then(
            (res) => {
                // router.replace("(tabs)")
                console.log(res.data.token)
                if (res.data.token !== null){
                    SecureStore.setItemAsync("token", res.data.token)
                    setState((prev) => ({...prev, ...{state:"LOGGED_IN", token: res.data.token}}))
                    router.replace("(tabs)")
                }
            }
        ).catch(
            (error) => {
                console.log("error")
                console.log(error)
            }
        )
    }

    useEffect(() => {
        SecureStore.getItemAsync("token").then(
            (token) => {
                if (token !== null) {
                    setState((prev) => ({...prev, ...{state:"LOGGED_IN", token: token}}))
                } else {
                    setState((prev) => ({...prev, ...{state:"LOGGED_OUT", token: ""}}))
                }
                if (state.state === "LOGGED_IN") {
                    router.replace("(tabs)")
                }
            }
        ).catch(
            (err) => {
              console.log("cannot get key")
              console.log(err)
            }
          )
        
    }, [])

    return (
        <LoginScreen
            logoImageSource={require('../assets/images/favicon.png')}
            onLoginPress={handleLogin}
            onSignupPress={handleRegister}
            onEmailChange={(value: string) => {
                setEmail(value)
            }}
            disableSocialButtons
            onPasswordChange={(password: string) => {
                setPassword(password)
            }}
            style={colorScheme == "dark" ? styles.dark: styles.light}
        />
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    light: {
        color: '#000',
        backgroundColor: '#fff',
        tint: '#2f95dc',
        tabIconDefault: '#ccc',
        tabIconSelected: '#2f95dc',
    },
    dark: {
        color: '#fff',
        backgroundColor: '#000',
        tint: '#fff',
        tabIconDefault: '#ccc',
        tabIconSelected: '#fff',
    }
})
