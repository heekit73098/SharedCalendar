// export const API_URL = "https://qwerty73098.pythonanywhere.com/api/"
// export const API_URL = "http://localhost:8000/api/"
export const API_URL = "http://10.0.2.2:8000/api/"

export const config = {
  withCredentials:true,
  xsrfHeaderName:"X-CSRFToken", 
  xsrfCookieName: "csrftoken" 
}

export const refererConfig = {
	headers: {
		"Referer": "https://qwerty73098.pythonanywhere.com/",
		"Referrer-Policy": "strict-origin-when-cross-origin"
	},
};