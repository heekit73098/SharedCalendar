import { useState } from "react";
import LoginScreen from "react-native-login-screen";
import { useColorScheme, StyleSheet, Platform, ScrollView, Button } from "react-native";
import { View, Text } from './Themed';
import TextInput from 'react-native-text-input-interactive';
import { KeyboardAvoidingView } from "react-native";
import AuthService from "../utils/authService";
import { useRouter } from "expo-router";


const RegisterForm = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [validation, setValidation] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [message, setMessage] = useState("")
    const [isRegistered, setRegistered] = useState(false)
    const colorScheme = useColorScheme();

    function goToLogin(){
        router.replace("/index")
    }

    function validate() {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/
        return re.test(password)
    }

    function handleRegister() {
        if (!validate()){
            setMessage("Password is too weak!")
            return
        }

        if (password !== validation){
            setMessage("Passwords do not match!")
            return
        }

        setMessage("")
        AuthService.register(email, password, firstName, lastName).then(
            (res) => {
                setMessage("Please check your email to verify your account!")
                setRegistered(true)
            }
        ).catch(
            (err) => {
                console.log(err)
                setMessage("Error registering, please try again.")
            }
        )
    }

    return (
        <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : -1000}
        >
            <ScrollView>
                <LoginScreen
                    logoImageSource={require('../assets/images/favicon.png')}
                    onLoginPress={handleRegister}
                    onSignupPress={() => {}}
                    onEmailChange={(value: string) => {
                        setEmail(value);
                    }}
                    loginButtonText={'Create an account'}
                    disableSignup
                    disableSocialButtons
                    textInputChildren={
                        <>
                            <View 
                                style={{marginTop: 16,  alignItems: "center", justifyContent: "center",}}
                            >
                            <TextInput
                                placeholder="Re-Password"
                                secureTextEntry
                                onChangeText={(value: string) => {setValidation(value)}}
                            />
                            </View>
                            <View 
                                style={{marginTop: 16,  alignItems: "center", justifyContent: "center",}}
                            >
                            <TextInput
                                placeholder="First Name"
                                onChangeText={(value: string) => {setFirstName(value)}}
                            />
                            </View>
                            <View 
                                style={{marginTop: 16,  alignItems: "center", justifyContent: "center",}}
                            >
                            <TextInput
                                placeholder="Last Name"
                                onChangeText={(value: string) => {setLastName(value)}}
                            />
                            </View>
                            <View 
                                style={{marginTop: 16,  alignItems: "center", justifyContent: "center",}}
                            >
                            </View>
                            <Text>{message}</Text>
                            {isRegistered && <Button
                                title="Back to login"
                                onPress={goToLogin}
                            />}
                            
                        </>
                    }
                    onPasswordChange={(password: string) => {setPassword(password)}}
                    style={colorScheme == "dark" ? styles.dark: styles.light}
                />
            </ScrollView>
            
        </KeyboardAvoidingView>
        
    );
};

export default RegisterForm;

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
