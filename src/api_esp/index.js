import axios from 'axios';

const apiConfig = {
  baseURL: process.env.VUE_APP_API_ESP_URL, 
  headers: {
    'Content-Type': 'aplication/json', 
  }
}

const ApiESPInstance = axios.create(apiConfig);

export default ApiESPInstance;