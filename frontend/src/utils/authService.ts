import axios from "axios";

const API_URL = "https://qwerty73098.pythonanywhere.com/api/"
const DEV_API_URL = "http://localhost:8000/api/"
const config = {
  withCredentials:true,
  xsrfHeaderName:"X-CSRFTOKEN", 
  xsrfCookieName: "csrftoken" 
}

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(DEV_API_URL + "login/", {
        username,
        password
      })
  }

  logout() {
    return axios
      .post(DEV_API_URL + "logout/", {}, config)
  }

  register(email: string, password: string, first_name: string, last_name: string) {
    return axios.post(DEV_API_URL + "register/", {
      username: email,
      email,
      password,
      first_name,
      last_name
    });
  }

  getUser() {
    return axios.get(DEV_API_URL + "session/", config)
  }

  changePassword(password: string){
    return axios.post(DEV_API_URL + "profile/", {
      password
    }, config)
  }

}

export default new AuthService();
