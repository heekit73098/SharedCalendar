import axios from "axios";
// TODO Update this with Backend
const API_URL = "http://localhost:8000/api/"

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "login/", {
        username,
        password
      }, {
        withCredentials:true,
        xsrfHeaderName:"X-CSRFTOKEN", 
        xsrfCookieName: "csrftoken" 
      })
      .then(response => {
        console.log(response)
      });
  }

  logout() {
    return axios
      .post(API_URL + "logout/", {}
      , {
        withCredentials:true,
        xsrfHeaderName:"X-CSRFTOKEN", 
        xsrfCookieName: "csrftoken" 
      })
      .then(response => {
        console.log(response)
      });
  }

  register(email: string, password: string, first_name: string, last_name: string) {
    return axios.post(API_URL + "register/", {
      username: email,
      email,
      password,
      first_name,
      last_name
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
