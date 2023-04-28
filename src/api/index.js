import axios from "axios";

const apiConfig = {
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "aplication/json",
  },
};

const ApiInstance = axios.create(apiConfig);

if (localStorage.getItem("token") !== null) {
  const token = localStorage.getItem("token");
  ApiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

ApiInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status == 401) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default ApiInstance;
