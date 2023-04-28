import ApiInstance from '@/api/index'

export const AuthAPI = {
  login(login, password){ 
     const url = '/auth/login';
     const loginRequest = {login, password}; 
     return ApiInstance.post(url, loginRequest);
  }, 
  register(time, login, email, password) {
    const url = '/auth/register';
    const registerRequest = {time, login, email, password }; 
    return ApiInstance.post(url, registerRequest); 
  },
  recovery(email) {
    const url = '/auth/recovery';
    return ApiInstance.post(url, email);
  }
}