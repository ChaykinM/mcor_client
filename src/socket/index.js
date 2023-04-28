// const wsUrl = "ws://192.168.66.62:81/"; 
// const wsUrl = "ws://192.168.0.12:81/"; 
// const wsUrl = "ws://192.168.43.205:81/"; 
// const wsUrl = "ws://192.168.1.65:81/"; 
const wsUrl = process.env.VUE_APP_SOCKET_URL; 
const socket = new WebSocket(wsUrl);
export default socket;