import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://realtime-quiz.fly.dev/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const login = async data => {
  try {
    const response = await apiClient.post('/login', JSON.stringify(data));
    return response.data; // Assuming you want to return the data property of the response
  } catch (error) {
    throw error;
  }
};

const me = async data => {
  try {
    apiClient.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`;
    const response = await apiClient.get('/me');
    return response.data; // Assuming you want to return the data property of the response
  } catch (error) {
    throw error;
  }
};

const register = async data => {
  try {
    const response = await apiClient.post('/register', JSON.stringify(data));
    return response.data; // Assuming you want to return the data property of the response
  } catch (error) {
    throw error;
  }
};
export default { login, me, register };
