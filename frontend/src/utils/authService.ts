import axios from "axios";

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

  getUser() {
    return axios.get(API_URL)
  }

  changePassword(password: string){
    return axios.post(API_URL + "profile/", {
      password
    }, {
      withCredentials:true,
      xsrfHeaderName:"X-CSRFTOKEN", 
      xsrfCookieName: "csrftoken" 
    })
  }

}

export default new AuthService();
